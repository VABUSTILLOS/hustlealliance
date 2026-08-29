import prisma from "@/lib/db/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

// ── Spaces (CommunityGroup rows with kind=SPACE) ─────────────────────────

export async function listSpaces(params: { userId?: string } = {}) {
  const spaces = await prisma.communityGroup.findMany({
    where: { kind: "SPACE" },
    orderBy: { memberCount: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      avatar: true,
      coverImage: true,
      memberCount: true,
      createdAt: true,
      _count: { select: { members: true, groupPosts: true, events: true } },
    },
  });

  if (!params.userId) return spaces;

  // Attach membership status for the requesting user.
  const memberships = await prisma.communityGroupMember.findMany({
    where: { userId: params.userId, status: "ACTIVE" },
    select: { groupId: true },
  });
  const joinedIds = new Set(memberships.map((m) => m.groupId));

  return spaces.map((space) => ({
    ...space,
    isJoined: joinedIds.has(space.id),
  }));
}

export async function getSpaceBySlug(slug: string, userId?: string) {
  const space = await prisma.communityGroup.findUnique({
    where: { slug },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { members: true, groupPosts: true, events: true } },
    },
  });
  if (!space || space.kind !== "SPACE") return null;

  let isJoined = false;
  if (userId) {
    const membership = await prisma.communityGroupMember.findUnique({
      where: { groupId_userId: { groupId: space.id, userId } },
    });
    isJoined = membership?.status === "ACTIVE";
  }

  return { ...space, isJoined };
}

export type { Prisma };
