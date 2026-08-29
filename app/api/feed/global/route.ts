import { NextRequest, NextResponse } from "next/server";
import { getGlobalFeed } from "@/lib/db/feed";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/feed/global
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "30");
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const feed = await getGlobalFeed({ limit, cursor, currentUserId: user.id });
    return NextResponse.json(feed, {
      headers: {
        // Response is user-specific (isLiked depends on the requesting user) — never cache publicly.
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
