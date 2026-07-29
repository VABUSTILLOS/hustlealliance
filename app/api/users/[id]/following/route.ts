import { NextRequest, NextResponse } from "next/server";
import { getFollowing } from "@/lib/db/social";

// GET /api/users/[id]/following — paginated following list
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const cursor = searchParams.get("cursor") ?? undefined;

    const following = await getFollowing(id, limit, cursor);
    return NextResponse.json(following);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
