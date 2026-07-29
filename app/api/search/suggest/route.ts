import { NextRequest, NextResponse } from "next/server";
import { searchSuggest } from "@/lib/db/search";

// GET /api/search/suggest?q=term
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = await searchSuggest(q, 5);
    return NextResponse.json({ suggestions, query: q });
  } catch (err) {
    console.error("[search/suggest] Error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
