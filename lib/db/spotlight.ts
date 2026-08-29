import prisma from "@/lib/db/prisma";

export interface SpotlightMember {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  activityCount: number;
}

/**
 * Weekly member spotlight: the member with the most community activity
 * (posts + comments) in the last 7 days. Returns null if nobody was active.
 */
export async function getWeeklySpotlight(excludeUserId?: string): Promise<SpotlightMember | null> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [posts, comments] = await Promise.all([
    prisma.communityPost.groupBy({
      by: ["authorId"],
      where: { createdAt: { gte: since }, isDeleted: false, ...(excludeUserId ? { authorId: { not: excludeUserId } } : {}) },
      _count: { _all: true },
    }),
    prisma.communityComment.groupBy({
      by: ["authorId"],
      where: { createdAt: { gte: since }, ...(excludeUserId ? { authorId: { not: excludeUserId } } : {}) },
      _count: { _all: true },
    }),
  ]);

  const totals = new Map<string, number>();
  for (const p of posts) totals.set(p.authorId, (totals.get(p.authorId) ?? 0) + p._count._all);
  for (const c of comments) totals.set(c.authorId, (totals.get(c.authorId) ?? 0) + c._count._all);
  if (totals.size === 0) return null;

  let topId = "";
  let topCount = 0;
  for (const [id, count] of totals) {
    if (count > topCount) {
      topId = id;
      topCount = count;
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: topId },
    select: { id: true, name: true, username: true, avatar: true },
  });
  if (!user) return null;
  return { ...user, activityCount: topCount };
}
