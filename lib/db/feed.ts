import prisma from "@/lib/db/prisma";
import type { FeedItemType } from "@/lib/generated/prisma/client";
import { Prisma } from "@/lib/generated/prisma/client";

// ── Fanout: insert a FeedItem per follower ─────────────────────────────

export async function fanoutToFollowers(params: {
  actorId: string;
  type: FeedItemType;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  excludeUserIds?: string[];
}) {
  // Get all followers
  const followers = await prisma.follow.findMany({
    where: { followedId: params.actorId },
    select: { followerId: true },
  });

  const ownerIds = followers
    .map((f) => f.followerId)
    .filter((id) => !params.excludeUserIds?.includes(id));

  if (!ownerIds.length) return [];

  // Batch insert feed items
  await prisma.feedItem.createMany({
    data: ownerIds.map((ownerId) => ({
      ownerId,
      actorId: params.actorId,
      type: params.type,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: (params.metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    })),
  });

  return ownerIds;
}

export async function fanoutToGroupMembers(params: {
  groupId: string;
  actorId: string;
  type: FeedItemType;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  excludeUserIds?: string[];
}) {
  const members = await prisma.communityGroupMember.findMany({
    where: { groupId: params.groupId, status: "ACTIVE" },
    select: { userId: true },
  });

  const ownerIds = members
    .map((m) => m.userId)
    .filter((id) => id !== params.actorId && !params.excludeUserIds?.includes(id));

  if (!ownerIds.length) return [];

  await prisma.feedItem.createMany({
    data: ownerIds.map((ownerId) => ({
      ownerId,
      actorId: params.actorId,
      type: params.type,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: (params.metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    })),
  });

  return ownerIds;
}

// ── Query user's feed ──────────────────────────────────────────────────

export async function getUserFeed(params: {
  userId: string;
  limit?: number;
  cursor?: string;
  types?: FeedItemType[];
}) {
  const where: Record<string, unknown> = { ownerId: params.userId };
  if (params.types?.length) where.type = { in: params.types };

  return prisma.feedItem.findMany({
    where,
    include: {
      actor: { select: { id: true, name: true, username: true, avatar: true } },
    },
    take: params.limit ?? 30,
    ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}

// ── Global / trending feed ────────────────────────────────────────────

export async function getGlobalFeed(params: {
  limit?: number;
  cursor?: string;
  currentUserId?: string;
}) {
  const posts = await prisma.communityPost.findMany({
    where: { visibility: "PUBLIC", groupId: null },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { likes: true, comments: true } },
      ...(params.currentUserId
        ? {
            likes: {
              where: { userId: params.currentUserId },
              select: { id: true },
              take: 1,
            },
          }
        : {}),
    },
    take: params.limit ?? 30,
    ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });

  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    visibility: post.visibility,
    groupId: post.groupId,
    createdAt: post.createdAt,
    author: post.author,
    _count: post._count,
    isLiked: (post as { likes?: { id: string }[] }).likes?.length ? true : undefined,
  }));
}

// ── Cleanup ─────────────────────────────────────────────────────────────

export async function cleanupOldFeedItems(userId: string, keepDays = 30) {
  const cutoff = new Date(Date.now() - keepDays * 24 * 60 * 60 * 1000);
  return prisma.feedItem.deleteMany({
    where: { ownerId: userId, createdAt: { lt: cutoff } },
  });
}
