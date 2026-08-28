import prisma from "@/lib/db/prisma";
import { Prisma, ProductType } from "@/lib/generated/prisma/client";
import type { ChallengeStatus } from "@/lib/generated/prisma/client";
import { awardXP } from "@/lib/db/progress";

const CHALLENGE_COMPLETE_XP = 100;

// ── Member: list / detail ───────────────────────────────────────────────

export interface ChallengeFilters {
  status?: ChallengeStatus;
  search?: string;
  limit?: number;
  cursor?: string;
  userId?: string;
}

export async function listChallenges(filters: ChallengeFilters = {}) {
  const where: Prisma.ChallengeWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { tasks: true, enrollments: true } },
        ...(filters.userId
          ? { enrollments: { where: { userId: filters.userId }, select: { id: true, completedAt: true } } }
          : {}),
      },
      take: filters.limit ?? 20,
      ...(filters.cursor ? { cursor: { id: filters.cursor }, skip: 1 } : {}),
      orderBy: { startDate: "asc" },
    }),
    prisma.challenge.count({ where }),
  ]);

  return { challenges, total };
}

export async function getChallengeBySlug(slug: string, userId?: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { slug },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true } },
      product: { select: { id: true, slug: true, price: true } },
      tasks: { orderBy: [{ dayNumber: "asc" }, { sortOrder: "asc" }] },
      _count: { select: { enrollments: true } },
    },
  });
  if (!challenge) return null;

  let enrollment = null;
  if (userId) {
    enrollment = await prisma.challengeEnrollment.findUnique({
      where: { challengeId_userId: { challengeId: challenge.id, userId } },
      include: { completions: true },
    });
  }

  const enrolled = !!enrollment;
  const isPaid = challenge.price > 0;

  return {
    ...challenge,
    enrolled,
    enrollment,
    paywalled: isPaid && !enrolled,
  };
}

// ── Member: enrollment / task completion ────────────────────────────────

export async function enrollInChallenge(challengeId: string, userId: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new Error("Challenge not found");
  if (challenge.price > 0) {
    throw new Error("This challenge requires payment; use the store checkout flow");
  }

  const existing = await prisma.challengeEnrollment.findUnique({
    where: { challengeId_userId: { challengeId, userId } },
  });
  if (existing) return existing;

  if (challenge.maxParticipants != null) {
    const count = await prisma.challengeEnrollment.count({ where: { challengeId } });
    if (count >= challenge.maxParticipants) throw new Error("Challenge is full");
  }

  return prisma.challengeEnrollment.create({
    data: { challengeId, userId },
  });
}

/**
 * Creates a ChallengeEnrollment for a PAID StoreOrder linked to a CHALLENGE
 * product. Idempotent — safe to call multiple times for the same order.
 */
export async function enrollFromPaidOrder(params: {
  challengeId: string;
  userId: string;
  storeOrderId: string;
}) {
  const existing = await prisma.challengeEnrollment.findUnique({
    where: { challengeId_userId: { challengeId: params.challengeId, userId: params.userId } },
  });
  if (existing) {
    if (!existing.storeOrderId) {
      return prisma.challengeEnrollment.update({
        where: { id: existing.id },
        data: { storeOrderId: params.storeOrderId },
      });
    }
    return existing;
  }

  return prisma.challengeEnrollment.create({
    data: {
      challengeId: params.challengeId,
      userId: params.userId,
      storeOrderId: params.storeOrderId,
    },
  });
}

export async function completeChallengeTask(params: {
  challengeId: string;
  userId: string;
  taskId: string;
  proofText?: string;
}) {
  const enrollment = await prisma.challengeEnrollment.findUnique({
    where: { challengeId_userId: { challengeId: params.challengeId, userId: params.userId } },
  });
  if (!enrollment) throw new Error("You are not enrolled in this challenge");

  const task = await prisma.challengeTask.findUnique({ where: { id: params.taskId } });
  if (!task || task.challengeId !== params.challengeId) throw new Error("Task not found");

  const completion = await prisma.challengeTaskCompletion.upsert({
    where: { enrollmentId_taskId: { enrollmentId: enrollment.id, taskId: params.taskId } },
    create: {
      enrollmentId: enrollment.id,
      taskId: params.taskId,
      proofText: params.proofText ?? null,
    },
    update: {
      proofText: params.proofText ?? null,
    },
  });

  // Check for full challenge completion
  const [totalTasks, completedTasks] = await Promise.all([
    prisma.challengeTask.count({ where: { challengeId: params.challengeId } }),
    prisma.challengeTaskCompletion.count({ where: { enrollmentId: enrollment.id } }),
  ]);

  if (totalTasks > 0 && completedTasks >= totalTasks && !enrollment.completedAt) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: params.challengeId },
      select: { title: true },
    });

    await prisma.challengeEnrollment.update({
      where: { id: enrollment.id },
      data: { completedAt: new Date() },
    });

    await awardXP(params.userId, CHALLENGE_COMPLETE_XP, `Completed challenge: ${challenge?.title ?? params.challengeId}`);

    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: "CHALLENGE_COMPLETED",
        title: "Challenge complete!",
        body: `You finished "${challenge?.title ?? "a challenge"}" — great work!`,
        sourceId: params.challengeId,
        metadata: { challengeId: params.challengeId },
      },
    });

    try {
      await prisma.feedItem.create({
        data: {
          ownerId: params.userId,
          actorId: params.userId,
          type: "CHALLENGE_COMPLETED",
          entityType: "challenge",
          entityId: params.challengeId,
          metadata: (challenge ? { title: challenge.title } : Prisma.JsonNull) as Prisma.InputJsonValue,
        },
      });
    } catch {
      // Non-fatal — feed is a nice-to-have
    }
  }

  return completion;
}

export async function getChallengeProgress(challengeId: string, userId: string) {
  const enrollment = await prisma.challengeEnrollment.findUnique({
    where: { challengeId_userId: { challengeId, userId } },
    include: { completions: true },
  });
  if (!enrollment) return null;

  const totalTasks = await prisma.challengeTask.count({ where: { challengeId } });
  const completedTasks = enrollment.completions.length;

  return {
    enrollment,
    totalTasks,
    completedTasks,
    percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    completed: !!enrollment.completedAt,
  };
}

// ── Admin: CRUD ──────────────────────────────────────────────────────────

export interface AdminChallengeFilters {
  status?: ChallengeStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function adminListChallenges(filters: AdminChallengeFilters = {}) {
  const where: Prisma.ChallengeWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { slug: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      include: {
        _count: { select: { tasks: true, enrollments: true } },
        product: { select: { id: true, slug: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.challenge.count({ where }),
  ]);

  return { challenges, total };
}

export async function getAdminChallengeById(id: string) {
  return prisma.challenge.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: [{ dayNumber: "asc" }, { sortOrder: "asc" }] },
      product: { select: { id: true, slug: true, price: true } },
      _count: { select: { enrollments: true } },
    },
  });
}

export interface ChallengeInput {
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  status?: ChallengeStatus;
  startDate: string | Date;
  endDate: string | Date;
  price?: number;
  currency?: string;
  maxParticipants?: number | null;
}

/** Creates or updates the linked CHALLENGE Product for a paid challenge, keeping title/slug/price mirrored. */
async function syncChallengeProduct(params: {
  challengeId: string;
  productId: string | null;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
}) {
  if (params.price <= 0) {
    return params.productId;
  }

  if (params.productId) {
    await prisma.product.update({
      where: { id: params.productId },
      data: {
        title: params.title,
        slug: `challenge-${params.slug}`,
        description: params.description ?? params.title,
        price: params.price,
        currency: params.currency,
        type: ProductType.CHALLENGE,
        isPublished: true,
        metadata: { challengeId: params.challengeId } as Prisma.InputJsonValue,
      },
    });
    return params.productId;
  }

  const product = await prisma.product.create({
    data: {
      title: params.title,
      slug: `challenge-${params.slug}`,
      description: params.description ?? params.title,
      type: ProductType.CHALLENGE,
      price: params.price,
      currency: params.currency,
      isPublished: true,
      metadata: { challengeId: params.challengeId } as Prisma.InputJsonValue,
    },
  });
  return product.id;
}

export async function createChallenge(input: ChallengeInput, creatorId: string) {
  const price = input.price ?? 0;
  const currency = input.currency ?? "USD";

  const challenge = await prisma.challenge.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description ?? null,
      coverImage: input.coverImage ?? null,
      status: input.status ?? "DRAFT",
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      price,
      currency,
      maxParticipants: input.maxParticipants ?? null,
      creatorId,
    },
  });

  if (price > 0) {
    const productId = await syncChallengeProduct({
      challengeId: challenge.id,
      productId: null,
      title: challenge.title,
      slug: challenge.slug,
      description: challenge.description,
      price,
      currency,
    });
    return prisma.challenge.update({
      where: { id: challenge.id },
      data: { productId },
      include: { product: true },
    });
  }

  return challenge;
}

export async function updateChallenge(id: string, input: Partial<ChallengeInput>) {
  const existing = await prisma.challenge.findUnique({ where: { id } });
  if (!existing) throw new Error("Challenge not found");

  const price = input.price ?? existing.price;
  const currency = input.currency ?? existing.currency;
  const title = input.title ?? existing.title;
  const slug = input.slug ?? existing.slug;
  const description = input.description !== undefined ? input.description : existing.description;

  let productId = existing.productId;
  if (price > 0) {
    productId = (await syncChallengeProduct({
      challengeId: id,
      productId: existing.productId,
      title,
      slug,
      description,
      price,
      currency,
    })) ?? null;
  }

  return prisma.challenge.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.coverImage !== undefined ? { coverImage: input.coverImage } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.startDate !== undefined ? { startDate: new Date(input.startDate) } : {}),
      ...(input.endDate !== undefined ? { endDate: new Date(input.endDate) } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.maxParticipants !== undefined ? { maxParticipants: input.maxParticipants } : {}),
      ...(productId !== existing.productId ? { productId } : {}),
    },
    include: { product: true, tasks: true },
  });
}

export async function deleteChallenge(id: string) {
  return prisma.challenge.delete({ where: { id } });
}

export interface ChallengeTaskInput {
  dayNumber: number;
  title: string;
  description?: string | null;
  sortOrder?: number;
}

/** Replaces all tasks for a challenge with the given set (delete + recreate). */
export async function upsertChallengeTasks(challengeId: string, tasks: ChallengeTaskInput[]) {
  await prisma.$transaction([
    prisma.challengeTask.deleteMany({ where: { challengeId } }),
    prisma.challengeTask.createMany({
      data: tasks.map((t, idx) => ({
        challengeId,
        dayNumber: t.dayNumber,
        title: t.title,
        description: t.description ?? null,
        sortOrder: t.sortOrder ?? idx,
      })),
    }),
  ]);

  return prisma.challengeTask.findMany({
    where: { challengeId },
    orderBy: [{ dayNumber: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getChallengeRoster(challengeId: string) {
  const [enrollments, totalTasks] = await Promise.all([
    prisma.challengeEnrollment.findMany({
      where: { challengeId },
      include: {
        user: { select: { id: true, name: true, username: true, avatar: true, email: true } },
        _count: { select: { completions: true } },
      },
      orderBy: { joinedAt: "asc" },
    }),
    prisma.challengeTask.count({ where: { challengeId } }),
  ]);

  return {
    totalTasks,
    roster: enrollments.map((e) => ({
      id: e.id,
      user: e.user,
      joinedAt: e.joinedAt,
      completedAt: e.completedAt,
      tasksCompleted: e._count.completions,
    })),
  };
}

export async function getChallengeStats(challengeId: string) {
  const [enrollmentCount, completedCount, orders] = await Promise.all([
    prisma.challengeEnrollment.count({ where: { challengeId } }),
    prisma.challengeEnrollment.count({ where: { challengeId, completedAt: { not: null } } }),
    prisma.challengeEnrollment.findMany({
      where: { challengeId, storeOrderId: { not: null } },
      select: { storeOrder: { select: { totalAmount: true, status: true } } },
    }),
  ]);

  const revenue = orders.reduce((sum, e) => {
    if (e.storeOrder && e.storeOrder.status === "PAID") return sum + e.storeOrder.totalAmount;
    return sum;
  }, 0);

  return {
    enrollmentCount,
    completedCount,
    completionRate: enrollmentCount > 0 ? Math.round((completedCount / enrollmentCount) * 100) : 0,
    revenue,
  };
}
