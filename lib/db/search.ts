import { prisma } from "@/lib/db/prisma";

// ── PostgreSQL FTS Unified Search ──────────────────────────────────────

export interface SearchResult {
  entityType: "user" | "post" | "group" | "event" | "job" | "product";
  entityId: string;
  rank: number;
  title: string;
  subtitle: string;
  avatarUrl: string | null;
  createdAt: Date;
}

export async function unifiedSearch(params: {
  term: string;
  entityTypes?: string[];
  limit?: number;
  offset?: number;
}): Promise<SearchResult[]> {
  const { term, entityTypes, limit = 20, offset = 0 } = params;

  // Sanitize and convert to tsquery format
  const sanitized = term
    .trim()
    .replace(/[':&|!()]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word}:*`)
    .join(" & ");

  if (!sanitized) return [];

  const types = entityTypes ?? ["user", "post", "group", "event", "job", "product"];
  const typePlaceholders = types.map((_, i) => `$${i + 1}`);

  const query = `
    SELECT * FROM unified_search(
      $${types.length + 1},
      ARRAY[${typePlaceholders.join(", ")}]::text[],
      $${types.length + 2}::int,
      $${types.length + 3}::int
    )
  `;

  return prisma.$queryRawUnsafe<SearchResult[]>(
    query,
    ...types,
    sanitized,
    limit,
    offset,
  );
}

// ── Prisma-based fallback search (when FTS not available) ──────────────

export async function searchUsers(query: string, limit = 20) {
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } },
        { bio: { contains: query, mode: "insensitive" } },
        { headline: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, username: true, avatar: true, headline: true },
    take: limit,
    orderBy: { name: "asc" },
  });
}

export async function searchPosts(query: string, limit = 20) {
  return prisma.communityPost.findMany({
    where: {
      visibility: "PUBLIC",
      content: { contains: query, mode: "insensitive" },
    },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function searchAll(term: string, limit = 20) {
  // Try FTS first; fall back to Prisma LIKE queries
  try {
    return await unifiedSearch({ term, limit });
  } catch {
    // FTS not available — use Prisma fallback
    const [users, posts] = await Promise.all([
      searchUsers(term, limit / 2),
      searchPosts(term, limit / 2),
    ]);

    return [
      ...users.map((u) => ({
        entityType: "user" as const,
        entityId: u.id,
        rank: 0,
        title: u.name,
        subtitle: u.headline ?? "",
        avatarUrl: u.avatar,
        createdAt: new Date(),
      })),
      ...posts.map((p) => ({
        entityType: "post" as const,
        entityId: p.id,
        rank: 0,
        title: p.content.slice(0, 100),
        subtitle: p.author.name,
        avatarUrl: p.author.avatar,
        createdAt: p.createdAt,
      })),
    ];
  }
}

// ── Track search queries ────────────────────────────────────────────────

export async function trackSearch(userId: string, term: string, results: number) {
  return prisma.searchQuery.create({
    data: { userId, term, results },
  });
}

export async function getTrendingSearches(limit = 10) {
  const queries = await prisma.searchQuery.groupBy({
    by: ["term"],
    _count: { term: true },
    orderBy: { _count: { term: "desc" } },
    take: limit,
    where: {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  });
  return queries.map((q) => ({ term: q.term, count: q._count.term }));
}
