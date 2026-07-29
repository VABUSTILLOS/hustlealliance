import { NextRequest, NextResponse } from "next/server";
import { getFollowers } from "@/lib/db/social";

// GET /api/users/[id]/followers — paginated followers list
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const cursor = searchParams.get("cursor") ?? undefined;

    const followers = await getFollowers(id, limit, cursor);
    return NextResponse.json(followers);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
