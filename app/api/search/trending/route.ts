import { NextResponse } from "next/server";
import { getTrendingSearches } from "@/lib/db/search";

// GET /api/search/trending
export async function GET() {
  try {
    const trending = await getTrendingSearches(10);
    return NextResponse.json({ trending });
  } catch (err) {
    console.error("[search/trending] Error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
