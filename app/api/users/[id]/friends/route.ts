import { NextRequest, NextResponse } from "next/server";
import { getFriends, getMutualFriendCount } from "@/lib/db/social";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/users/[id]/friends — mutual friends list + count
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const cursor = searchParams.get("cursor") ?? undefined;

    const friends = await getFriends(id, limit, cursor);

    // If current user, also return mutual friend count
    const currentUser = await getCurrentUser();
    let mutualCount = 0;
    if (currentUser && currentUser.id !== id) {
      mutualCount = await getMutualFriendCount(currentUser.id, id);
    }

    return NextResponse.json({ friends, mutualCount });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
