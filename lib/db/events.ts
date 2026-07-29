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
      _count: { select: { rsvps: true } },
    },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true } },
      group: { select: { id: true, name: true, slug: true } },
      rsvps: {
        where: { status: "GOING" },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
    },
  });
}

export async function listEvents(params: {
  status?: EventStatus;
  groupId?: string;
  limit?: number;
  cursor?: string;
}) {
  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.groupId) where.groupId = params.groupId;

  return prisma.event.findMany({
    where,
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      _count: { select: { rsvps: true } },
    },
    take: params.limit ?? 20,
    ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    orderBy: { startDate: "asc" },
  });
}

export async function getUpcomingEvents(limit = 10) {
  return prisma.event.findMany({
    where: { status: "UPCOMING", startDate: { gte: new Date() } },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      _count: { select: { rsvps: true } },
    },
    take: limit,
    orderBy: { startDate: "asc" },
  });
}

export async function getUserEvents(userId: string, limit = 20) {
  const rsvps = await prisma.eventRSVP.findMany({
    where: { userId, status: "GOING" },
    include: {
      event: {
        include: {
          creator: { select: { id: true, name: true, avatar: true } },
          _count: { select: { rsvps: true } },
        },
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return rsvps.map((r) => r.event);
}

export async function updateEvent(id: string, data: {
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
  return prisma.event.update({ where: { id }, data });
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } });
}

// ── RSVPs ───────────────────────────────────────────────────────────────

export async function rsvp(eventId: string, userId: string, status: RSVPStatus = "GOING") {
  // Check capacity
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { maxAttendees: true, _count: { select: { rsvps: { where: { status: "GOING" } } } } },
  });

  if (event?.maxAttendees && status === "GOING") {
    const going = event._count.rsvps;
    // Check if user already has a GOING RSVP
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
