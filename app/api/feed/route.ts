import { NextRequest, NextResponse } from "next/server";
import { getUserFeed } from "@/lib/db/feed";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/feed
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "30");
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const feed = await getUserFeed({ userId: user.id, limit, cursor });
    return NextResponse.json(feed);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
