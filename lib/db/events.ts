import prisma from "@/lib/db/prisma";
import type { EventType, EventStatus, RSVPStatus } from "@/lib/generated/prisma/client";

// ── CRUD ────────────────────────────────────────────────────────────────

export async function createEvent(params: {
  title: string;
  slug: string;
  description?: string;
  type?: EventType;
  location?: string;
  startDate: Date;
  endDate?: Date;
  coverImage?: string;
  maxAttendees?: number;
  creatorId: string;
  groupId?: string;
}) {
  return prisma.event.create({
    data: {
      title: params.title,
      slug: params.slug,
      description: params.description ?? null,
      type: params.type ?? "ONLINE",
      location: params.location ?? null,
      startDate: params.startDate,
      endDate: params.endDate ?? null,
      coverImage: params.coverImage ?? null,
      maxAttendees: params.maxAttendees ?? null,
      creatorId: params.creatorId,
      groupId: params.groupId ?? null,
    },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true } },
    },
  });
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true } },
      group: { select: { id: true, name: true, slug: true, avatar: true } },
      _count: {
        select: {
          rsvps: { where: { status: "GOING" } },
          discussions: true,
        },
      },
    },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true } },
      group: { select: { id: true, name: true, slug: true } },
      _count: {
        select: {
          rsvps: { where: { status: "GOING" } },
          discussions: true,
        },
      },
    },
  });
}

export async function listEvents(params: {
  status?: EventStatus;
  type?: EventType;
  groupId?: string;
  search?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  limit?: number;
  cursor?: string;
}) {
  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.type) where.type = params.type;
  if (params.groupId) where.groupId = params.groupId;
  if (params.search) where.title = { contains: params.search, mode: "insensitive" };
  if (params.startDateFrom || params.startDateTo) {
    where.startDate = {};
    if (params.startDateFrom) (where.startDate as Record<string, unknown>).gte = params.startDateFrom;
    if (params.startDateTo) (where.startDate as Record<string, unknown>).lte = params.startDateTo;
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { rsvps: { where: { status: "GOING" } } } },
      },
      take: params.limit ?? 20,
      ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
      orderBy: { startDate: "asc" },
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total };
}

export async function getUpcomingEvents(limit = 10) {
  return prisma.event.findMany({
    where: {
      status: { in: ["UPCOMING", "LIVE"] },
      startDate: { gte: new Date() },
    },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      _count: { select: { rsvps: { where: { status: "GOING" } } } },
    },
    take: limit,
    orderBy: { startDate: "asc" },
  });
}

export async function getUserEvents(userId: string, status?: RSVPStatus, limit = 20) {
  const rsvps = await prisma.eventRSVP.findMany({
    where: { userId, ...(status ? { status } : {}) },
    include: {
      event: {
        include: {
          creator: { select: { id: true, name: true, avatar: true } },
          _count: { select: { rsvps: { where: { status: "GOING" } } } },
        },
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return rsvps.map((r) => r.event);
}

export async function updateEvent(id: string, userId: string, data: {
  title?: string;
  description?: string;
  type?: EventType;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  coverImage?: string;
  maxAttendees?: number;
  status?: EventStatus;
}) {
  // Verify ownership or admin
  const event = await prisma.event.findUnique({ where: { id }, select: { creatorId: true } });
  if (!event) throw new Error("Event not found");
  if (event.creatorId !== userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== "ADMIN") throw new Error("Forbidden");
  }
  return prisma.event.update({ where: { id }, data });
}

export async function cancelEvent(id: string, userId: string) {
  // Verify ownership or admin
  const event = await prisma.event.findUnique({ where: { id }, select: { creatorId: true } });
  if (!event) throw new Error("Event not found");
  if (event.creatorId !== userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== "ADMIN") throw new Error("Forbidden");
  }
  return prisma.event.update({ where: { id }, data: { status: "CANCELLED" } });
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } });
}

// ── RSVPs ───────────────────────────────────────────────────────────────

export async function rsvp(eventId: string, userId: string, status: RSVPStatus = "GOING") {
  // Check capacity
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { maxAttendees: true, status: true, _count: { select: { rsvps: { where: { status: "GOING" } } } } },
  });

  if (!event) throw new Error("Event not found");
  if (event.status === "CANCELLED" || event.status === "ENDED") {
    throw new Error("Cannot RSVP to a cancelled or ended event");
  }

  if (event.maxAttendees && status === "GOING") {
    const going = event._count.rsvps;
    const existing = await prisma.eventRSVP.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (existing?.status !== "GOING" && going >= event.maxAttendees) {
      throw new Error("Event is at capacity");
    }
  }

  return prisma.eventRSVP.upsert({
    where: { eventId_userId: { eventId, userId } },
    create: { eventId, userId, status },
    update: { status, updatedAt: new Date() },
  });
}

export async function getEventAttendees(
  eventId: string,
  status?: RSVPStatus,
  limit = 50,
  cursor?: string
) {
  return prisma.eventRSVP.findMany({
    where: { eventId, ...(status ? { status } : {}) },
    include: {
      user: { select: { id: true, name: true, username: true, avatar: true, headline: true } },
    },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "asc" },
  });
}

export async function getRSVPs(eventId: string, status?: RSVPStatus, limit = 50) {
  return prisma.eventRSVP.findMany({
    where: { eventId, ...(status ? { status } : {}) },
    include: { user: { select: { id: true, name: true, username: true, avatar: true } } },
    take: limit,
    orderBy: { createdAt: "asc" },
  });
}

export async function getUserRSVP(eventId: string, userId: string) {
  return prisma.eventRSVP.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });
}

// ── Event Discussions ──────────────────────────────────────────────────

export async function addEventDiscussion(eventId: string, userId: string, content: string) {
  return prisma.eventDiscussion.create({
    data: { eventId, userId, content },
    include: {
      user: { select: { id: true, name: true, username: true, avatar: true } },
    },
  });
}

export async function getEventDiscussions(
  eventId: string,
  limit = 20,
  cursor?: string
) {
  const [discussions, total] = await Promise.all([
    prisma.eventDiscussion.findMany({
      where: { eventId },
      include: {
        user: { select: { id: true, name: true, username: true, avatar: true } },
      },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "asc" },
    }),
    prisma.eventDiscussion.count({ where: { eventId } }),
  ]);

  return { discussions, total };
}
