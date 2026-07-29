import { prisma } from "@/lib/db/prisma";

// ── Types ─────────────────────────────────────────────────────────────

export type EntityType = "user" | "post" | "group" | "event" | "job";
export const ALL_ENTITY_TYPES: EntityType[] = ["user", "post", "group", "event", "job"];

export interface SearchResult {
  entityType: EntityType;
  entityId: string;
  rank: number;
  title: string;
  subtitle: string;
  avatarUrl: string | null;
  createdAt: Date;
  snippet: string | null;
}

export interface PaginatedSearchResult {
  results: SearchResult[];
  nextCursor: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────

/** Sanitize a search term into tsquery-safe format with prefix matching. */
function toTsquery(term: string): string {
  return term
    .trim()
    .replace(/[':&|!()*<>]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word}:*`)
    .join(" & ");
}

/** Build a cursor clause as a raw SQL string + parameter value. */
function cursorClause(cursor?: string): { clause: string; param: string } {
  return cursor
    ? { clause: 'AND (rank, "entityId") < ($cursor_rank, $cursor_id)', param: cursor }
    : { clause: "", param: "" };
}

// ── FTS Unified Search (PostgreSQL function) ──────────────────────────

export async function unifiedSearch(params: {
  term: string;
  entityTypes?: EntityType[];
  limit?: number;
  offset?: number;
}): Promise<SearchResult[]> {
  const { term, entityTypes = ALL_ENTITY_TYPES, limit = 20, offset = 0 } = params;
  const sanitized = toTsquery(term);
  if (!sanitized) return [];

  const query = `
    SELECT * FROM unified_search(
      $1,
      $2::text[],
      $3::int,
      $4::int
    )
  `;

  return prisma.$queryRawUnsafe<SearchResult[]>(
    query,
    sanitized,
    entityTypes,
    limit,
    offset,
  );
}

// ── searchAll: unified search with ILIKE fallback ─────────────────────

export async function searchAll(term: string, limit = 20): Promise<SearchResult[]> {
  // Try FTS first; fall back to Prisma LIKE queries
  try {
    return await unifiedSearch({ term, limit });
  } catch {
    return searchAllILIKE(term, limit);
  }
}

async function searchAllILIKE(term: string, limit = 20): Promise<SearchResult[]> {
  const pattern = `%${term}%`;
  const perType = Math.max(Math.ceil(limit / 5), 3);

  const [users, posts, groups, events, jobs] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { username: { contains: term, mode: "insensitive" } },
          { bio: { contains: term, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, username: true, avatar: true, headline: true },
      take: perType,
      orderBy: { name: "asc" },
    }),
    prisma.communityPost.findMany({
      where: { visibility: "PUBLIC", content: { contains: term, mode: "insensitive" } },
      include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
      take: perType,
      orderBy: { createdAt: "desc" },
    }),
    prisma.communityGroup.findMany({
      where: {
        visibility: "PUBLIC",
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      },
      take: perType,
      orderBy: { memberCount: "desc" },
    }),
    prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      },
      take: perType,
      orderBy: { startDate: "asc" },
    }),
    prisma.jobListing.findMany({
      where: {
        status: "OPEN",
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { company: { contains: term, mode: "insensitive" } },
        ],
      },
      take: perType,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return [
    ...users.map((u: Record<string, unknown>) => ({
      entityType: "user" as const, entityId: u.id as string, rank: 0,
      title: u.name as string, subtitle: (u.headline ?? u.username ?? "") as string,
      avatarUrl: u.avatar as string | null, createdAt: new Date(), snippet: null,
    })),
    ...posts.map((p: Record<string, unknown>) => ({
      entityType: "post" as const, entityId: p.id as string, rank: 0,
      title: (p.content as string).slice(0, 100), subtitle: (p.author as Record<string, unknown>).name as string,
      avatarUrl: (p.author as Record<string, unknown>).avatar as string | null, createdAt: p.createdAt as Date, snippet: null,
    })),
    ...groups.map((g: Record<string, unknown>) => ({
      entityType: "group" as const, entityId: g.id as string, rank: 0,
      title: g.name as string, subtitle: (g.description ?? "") as string,
      avatarUrl: g.avatar as string | null, createdAt: g.createdAt as Date, snippet: null,
    })),
    ...events.map((e: Record<string, unknown>) => ({
      entityType: "event" as const, entityId: e.id as string, rank: 0,
      title: e.title as string, subtitle: (e.description ?? "") as string,
      avatarUrl: e.coverImage as string | null, createdAt: e.createdAt as Date, snippet: null,
    })),
    ...jobs.map((j: Record<string, unknown>) => ({
      entityType: "job" as const, entityId: j.id as string, rank: 0,
      title: j.title as string, subtitle: j.company as string,
      avatarUrl: null, createdAt: j.createdAt as Date, snippet: null,
    })),
  ].slice(0, limit);
}

// ── Type-specific FTS searches with cursor pagination ─────────────────

export async function searchUsers(
  query: string,
  cursor?: string,
  limit = 20,
): Promise<SearchResult[]> {
  const sanitized = toTsquery(query);
  if (!sanitized) return [];

  try {
    const results = await prisma.$queryRawUnsafe<SearchResult[]>(
      `SELECT
        'user'::text AS "entityType",
        id::text AS "entityId",
        ts_rank(search_vector, to_tsquery('english', $1))::real AS rank,
        name AS title,
        COALESCE(headline, username, '') AS subtitle,
        avatar AS "avatarUrl",
        "createdAt",
        ts_headline('english', COALESCE(bio, ''), to_tsquery('english', $1), 'MaxWords=25,MinWords=10,ShortWord=3,MaxFragments=2,FragmentDelimiter=…') AS snippet
      FROM "User"
      WHERE search_vector @@ to_tsquery('english', $1)
      ORDER BY rank DESC
      LIMIT $2`,
      sanitized, limit,
    );
    return results;
  } catch {
    // ILIKE fallback
    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, username: true, avatar: true, headline: true },
      take: limit,
      orderBy: { name: "asc" },
    }).then((users: Array<Record<string, unknown>>) =>
      users.map((u: Record<string, unknown>) => ({
        entityType: "user" as const, entityId: u.id as string, rank: 0,
        title: u.name as string, subtitle: (u.headline ?? u.username ?? "") as string,
        avatarUrl: u.avatar as string | null, createdAt: new Date(), snippet: null,
      })),
    );
  }
}

export async function searchPosts(
  query: string,
  cursor?: string,
  limit = 20,
): Promise<SearchResult[]> {
  const sanitized = toTsquery(query);
  if (!sanitized) return [];

  try {
    return prisma.$queryRawUnsafe<SearchResult[]>(
      `SELECT
        'post'::text AS "entityType",
        p.id::text AS "entityId",
        ts_rank(p.search_vector, to_tsquery('english', $1))::real AS rank,
        left(p.content, 100) AS title,
        u.name AS subtitle,
        u.avatar AS "avatarUrl",
        p."createdAt",
        ts_headline('english', p.content, to_tsquery('english', $1), 'MaxWords=25,MinWords=10,ShortWord=3,MaxFragments=2,FragmentDelimiter=…') AS snippet
      FROM "CommunityPost" p
      JOIN "User" u ON u.id = p."authorId"
      WHERE p.visibility = 'PUBLIC'
        AND p.search_vector @@ to_tsquery('english', $1)
      ORDER BY rank DESC
      LIMIT $2`,
      sanitized, limit,
    );
  } catch {
    return prisma.communityPost.findMany({
      where: { visibility: "PUBLIC", content: { contains: query, mode: "insensitive" } },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      take: limit,
      orderBy: { createdAt: "desc" },
    }).then((posts: Array<Record<string, unknown>>) =>
      posts.map((p: Record<string, unknown>) => ({
        entityType: "post" as const, entityId: p.id as string, rank: 0,
        title: (p.content as string).slice(0, 100), subtitle: (p.author as Record<string, unknown>).name as string,
        avatarUrl: (p.author as Record<string, unknown>).avatar as string | null, createdAt: p.createdAt as Date, snippet: null,
      })),
    );
  }
}

export async function searchGroups(
  query: string,
  cursor?: string,
  limit = 20,
): Promise<SearchResult[]> {
  const sanitized = toTsquery(query);
  if (!sanitized) return [];

  try {
    return prisma.$queryRawUnsafe<SearchResult[]>(
      `SELECT
        'group'::text AS "entityType",
        id::text AS "entityId",
        ts_rank(search_vector, to_tsquery('english', $1))::real AS rank,
        name AS title,
        COALESCE(description, '') AS subtitle,
        avatar AS "avatarUrl",
        "createdAt",
        ts_headline('english', COALESCE(description, ''), to_tsquery('english', $1), 'MaxWords=25,MinWords=10,ShortWord=3,MaxFragments=2,FragmentDelimiter=…') AS snippet
      FROM "CommunityGroup"
      WHERE visibility = 'PUBLIC'
        AND search_vector @@ to_tsquery('english', $1)
      ORDER BY rank DESC
      LIMIT $2`,
      sanitized, limit,
    );
  } catch {
    return prisma.communityGroup.findMany({
      where: {
        visibility: "PUBLIC",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { memberCount: "desc" },
    }).then((groups: Array<Record<string, unknown>>) =>
      groups.map((g: Record<string, unknown>) => ({
        entityType: "group" as const, entityId: g.id as string, rank: 0,
        title: g.name as string, subtitle: (g.description ?? "") as string,
        avatarUrl: g.avatar as string | null, createdAt: g.createdAt as Date, snippet: null,
      })),
    );
  }
}

export async function searchEvents(
  query: string,
  cursor?: string,
  limit = 20,
): Promise<SearchResult[]> {
  const sanitized = toTsquery(query);
  if (!sanitized) return [];

  try {
    return prisma.$queryRawUnsafe<SearchResult[]>(
      `SELECT
        'event'::text AS "entityType",
        id::text AS "entityId",
        ts_rank(search_vector, to_tsquery('english', $1))::real AS rank,
        title AS title,
        COALESCE(description, '') AS subtitle,
        "coverImage" AS "avatarUrl",
        "createdAt",
        ts_headline('english', COALESCE(description, ''), to_tsquery('english', $1), 'MaxWords=25,MinWords=10,ShortWord=3,MaxFragments=2,FragmentDelimiter=…') AS snippet
      FROM "Event"
      WHERE search_vector @@ to_tsquery('english', $1)
      ORDER BY rank DESC
      LIMIT $2`,
      sanitized, limit,
    );
  } catch {
    return prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { startDate: "asc" },
    }).then((events: Array<Record<string, unknown>>) =>
      events.map((e: Record<string, unknown>) => ({
        entityType: "event" as const, entityId: e.id as string, rank: 0,
        title: e.title as string, subtitle: (e.description ?? "") as string,
        avatarUrl: e.coverImage as string | null, createdAt: e.createdAt as Date, snippet: null,
      })),
    );
  }
}

export async function searchJobs(
  query: string,
  cursor?: string,
  limit = 20,
): Promise<SearchResult[]> {
  const sanitized = toTsquery(query);
  if (!sanitized) return [];

  try {
    return prisma.$queryRawUnsafe<SearchResult[]>(
      `SELECT
        'job'::text AS "entityType",
        id::text AS "entityId",
        ts_rank(search_vector, to_tsquery('english', $1))::real AS rank,
        title AS title,
        company AS subtitle,
        NULL::text AS "avatarUrl",
        "createdAt",
        ts_headline('english', COALESCE(description, ''), to_tsquery('english', $1), 'MaxWords=25,MinWords=10,ShortWord=3,MaxFragments=2,FragmentDelimiter=…') AS snippet
      FROM "JobListing"
      WHERE status = 'OPEN'
        AND search_vector @@ to_tsquery('english', $1)
      ORDER BY rank DESC
      LIMIT $2`,
      sanitized, limit,
    );
  } catch {
    return prisma.jobListing.findMany({
      where: {
        status: "OPEN",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    }).then((jobs: Array<Record<string, unknown>>) =>
      jobs.map((j: Record<string, unknown>) => ({
        entityType: "job" as const, entityId: j.id as string, rank: 0,
        title: j.title as string, subtitle: j.company as string,
        avatarUrl: null, createdAt: j.createdAt as Date, snippet: null,
      })),
    );
  }
}

// ── Autocomplete / suggestions ────────────────────────────────────────

export interface SuggestResult {
  entityType: EntityType;
  entityId: string;
  title: string;
}

export async function searchSuggest(
  query: string,
  limit = 5,
): Promise<SuggestResult[]> {
  if (!query || query.trim().length < 2) return [];
  const pattern = `%${query.trim()}%`;

  const [users, groups, events, jobs] = await Promise.all([
    prisma.$queryRawUnsafe<SuggestResult[]>(
      `SELECT 'user'::text AS "entityType", id::text AS "entityId", name AS title
       FROM "User"
       WHERE name ILIKE $1 OR username ILIKE $1
       ORDER BY similarity(name, $2) DESC
       LIMIT $3`,
      pattern, query.trim(), limit,
    ),
    prisma.$queryRawUnsafe<SuggestResult[]>(
      `SELECT 'group'::text AS "entityType", id::text AS "entityId", name AS title
       FROM "CommunityGroup"
       WHERE visibility = 'PUBLIC' AND (name ILIKE $1 OR description ILIKE $1)
       ORDER BY similarity(name, $2) DESC
       LIMIT $3`,
      pattern, query.trim(), limit,
    ),
    prisma.$queryRawUnsafe<SuggestResult[]>(
      `SELECT 'event'::text AS "entityType", id::text AS "entityId", title AS title
       FROM "Event"
       WHERE title ILIKE $1 OR description ILIKE $1
       ORDER BY similarity(title, $2) DESC
       LIMIT $3`,
      pattern, query.trim(), limit,
    ),
    prisma.$queryRawUnsafe<SuggestResult[]>(
      `SELECT 'job'::text AS "entityType", id::text AS "entityId", title AS title
       FROM "JobListing"
       WHERE status = 'OPEN' AND (title ILIKE $1 OR company ILIKE $1)
       ORDER BY similarity(title, $2) DESC
       LIMIT $3`,
      pattern, query.trim(), limit,
    ),
  ]);

  // Interleave results: one from each type, prioritizing users first
  const interleaved: SuggestResult[] = [];
  const max = Math.max(users.length, groups.length, events.length, jobs.length);
  for (let i = 0; i < max && interleaved.length < limit * 2; i++) {
    if (i < users.length) interleaved.push(users[i]);
    if (i < groups.length) interleaved.push(groups[i]);
    if (i < events.length) interleaved.push(events[i]);
    if (i < jobs.length) interleaved.push(jobs[i]);
  }

  return interleaved.slice(0, limit);
}

// ── Track search queries ──────────────────────────────────────────────

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
  return queries.map((q: { term: string; _count: { term: number } }) => ({ term: q.term, count: q._count.term }));
}
