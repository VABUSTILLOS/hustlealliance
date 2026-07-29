import { NextRequest, NextResponse } from "next/server";
import { getGroupFeed } from "@/lib/db/groups";

// GET /api/groups/[id]/feed
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const cursor = url.searchParams.get("cursor") ?? undefined;

    const posts = await getGroupFeed(id, limit, cursor);
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
