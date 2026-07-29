import { NextRequest, NextResponse } from "next/server";
import { searchAll, unifiedSearch, trackSearch } from "@/lib/db/search";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/search?q=...&types=user,post,group,event,job,product&limit=20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const types = searchParams.get("types")?.split(",") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const offset = parseInt(searchParams.get("offset") ?? "0");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  try {
    let results;
    if (types) {
      results = await unifiedSearch({ term: q, entityTypes: types, limit, offset });
    } else {
      results = await searchAll(q, limit);
    }

    // Track search (non-blocking)
    const user = await getCurrentUser();
    if (user) {
      trackSearch(user.id, q, results.length).catch(() => {});
    }

    return NextResponse.json({ results, query: q });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
