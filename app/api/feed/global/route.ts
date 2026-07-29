import { NextRequest, NextResponse } from "next/server";
import { getGlobalFeed } from "@/lib/db/feed";

// GET /api/feed/global
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "30");
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const feed = await getGlobalFeed({ limit, cursor });
    return NextResponse.json(feed);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
