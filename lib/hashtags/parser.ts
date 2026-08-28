import prisma from "@/lib/db/prisma";

const HASHTAG_RE = /#([\p{L}\p{N}_]+)/gu;

export function extractHashtags(content: string): string[] {
  const tags = new Set<string>();
  for (const match of content.matchAll(HASHTAG_RE)) {
    const tag = match[1].toLowerCase();
    if (tag.length >= 2 && tag.length <= 50) tags.add(tag);
  }
  return [...tags].slice(0, 10);
}

export async function syncPostHashtags(postId: string, content: string) {
  const names = extractHashtags(content);
  const existing = await prisma.postHashtag.findMany({
    where: { postId },
    include: { hashtag: true },
  });
  const existingNames = new Set(existing.map((e) => e.hashtag.name));
  const toAdd = names.filter((n) => !existingNames.has(n));
  const toRemove = existing.filter((e) => !names.includes(e.hashtag.name));

  for (const name of toAdd) {
    const hashtag = await prisma.hashtag.upsert({
      where: { name },
      update: { postCount: { increment: 1 } },
      create: { name, postCount: 1 },
    });
    await prisma.postHashtag
      .create({ data: { postId, hashtagId: hashtag.id } })
      .catch(() => {});
  }

  for (const entry of toRemove) {
    await prisma.postHashtag
      .delete({
        where: {
          postId_hashtagId: { postId, hashtagId: entry.hashtagId },
        },
      })
      .catch(() => {});
    await prisma.hashtag
      .update({
        where: { id: entry.hashtagId },
        data: { postCount: { decrement: 1 } },
      })
      .catch(() => {});
  }
}

export async function getTrendingHashtags(limit = 5) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return prisma.$queryRawUnsafe<{ name: string; postCount: number }[]>(
    `
    SELECT h."name", COUNT(ph."postId")::int AS "postCount"
    FROM "PostHashtag" ph
    JOIN "Hashtag" h ON h."id" = ph."hashtagId"
    JOIN "CommunityPost" p ON p."id" = ph."postId"
    WHERE p."createdAt" >= $1
      AND p."isDeleted" = false
    GROUP BY h."name"
    ORDER BY "postCount" DESC, h."name" ASC
    LIMIT $2
    `,
    sevenDaysAgo,
    limit,
  );
}
