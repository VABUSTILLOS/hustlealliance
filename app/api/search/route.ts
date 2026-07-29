import { NextRequest, NextResponse } from "next/server";
import { searchAll, unifiedSearch, trackSearch } from "@/lib/db/search";
import type { EntityType } from "@/lib/db/search";
import { getCurrentUser } from "@/lib/auth/user";

const VALID_TYPES: EntityType[] = ["user", "post", "group", "event", "job"];

// GET /api/search?q=...&type=all|users|posts|groups|events|jobs&cursor=&limit=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const type = searchParams.get("type") ?? "all";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20") || 20, 100);
  const cursor = searchParams.get("cursor") ?? undefined;

  if (!q || q.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  try {
    let results;

    if (type === "all") {
      results = await searchAll(q, limit);
    } else {
      // Map plural type names to entity types
      const typeMap: Record<string, EntityType> = {
        users: "user",
        posts: "post",
        groups: "group",
        events: "event",
        jobs: "job",
      };
      const entityType = typeMap[type];

      if (!entityType) {
        return NextResponse.json(
          { error: `Invalid type. Must be all, users, posts, groups, events, or jobs` },
          { status: 400 },
        );
      }

      results = await unifiedSearch({ term: q, entityTypes: [entityType], limit });
    }

    // Track search (non-blocking)
    const user = await getCurrentUser();
    if (user) {
      trackSearch(user.id, q, results.length).catch(() => {});
    }

    return NextResponse.json({ results, query: q, total: results.length });
  } catch (err) {
    console.error("[search] Error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
