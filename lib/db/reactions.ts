import prisma from "@/lib/db/prisma";
import type { ReactionType } from "@/lib/generated/prisma/client";

export const REACTION_TYPES: ReactionType[] = ["LIKE", "LOVE", "FIRE", "CLAP"];

export type ReactionCounts = Partial<Record<ReactionType, number>>;

// ── Post reactions ──────────────────────────────────────────────────────

export async function reactToPost(postId: string, userId: string, type: ReactionType = "LIKE") {
  return prisma.postLike.upsert({
    where: { postId_userId: { postId, userId } },
    create: { postId, userId, type },
    update: { type },
  });
}

export async function unreactToPost(postId: string, userId: string) {
  return prisma.postLike.delete({
    where: { postId_userId: { postId, userId } },
  });
}

// ── Comment reactions ───────────────────────────────────────────────────

export async function reactToComment(commentId: string, userId: string, type: ReactionType = "LIKE") {
  return prisma.commentLike.upsert({
    where: { commentId_userId: { commentId, userId } },
    create: { commentId, userId, type },
    update: { type },
  });
}

export async function unreactToComment(commentId: string, userId: string) {
  return prisma.commentLike.delete({
    where: { commentId_userId: { commentId, userId } },
  });
}

// ── Aggregates ──────────────────────────────────────────────────────────

export interface PostReactionSummary {
  counts: ReactionCounts;
  total: number;
  myReaction: ReactionType | null;
}

/**
 * Grouped reaction counts for a page of posts, plus the requesting user's
 * reaction per post. Two queries total regardless of page size.
 */
export async function getPostReactionSummaries(
  postIds: string[],
  currentUserId?: string,
): Promise<Map<string, PostReactionSummary>> {
  const map = new Map<string, PostReactionSummary>();
  if (postIds.length === 0) return map;

  const grouped = await prisma.postLike.groupBy({
    by: ["postId", "type"],
    where: { postId: { in: postIds } },
    _count: { _all: true },
  });

  for (const row of grouped) {
    const entry = map.get(row.postId) ?? { counts: {}, total: 0, myReaction: null };
    entry.counts[row.type] = row._count._all;
    entry.total += row._count._all;
    map.set(row.postId, entry);
  }

  if (currentUserId) {
    const mine = await prisma.postLike.findMany({
      where: { postId: { in: postIds }, userId: currentUserId },
      select: { postId: true, type: true },
    });
    for (const row of mine) {
      const entry = map.get(row.postId) ?? { counts: {}, total: 0, myReaction: null };
      entry.myReaction = row.type;
      map.set(row.postId, entry);
    }
  }

  return map;
}
