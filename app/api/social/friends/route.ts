import { NextRequest, NextResponse } from "next/server";
import { sendFriendRequest, getFriends, getPendingFriendRequests } from "@/lib/db/social";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/social/friends — get friends or pending requests
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "friends";
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    if (type === "pending") {
      const requests = await getPendingFriendRequests(user.id);
      return NextResponse.json(requests);
    }
    const friends = await getFriends(user.id, limit);
    return NextResponse.json(friends);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/social/friends — send friend request { userId }
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { userId } = await req.json();
    const friendship = await sendFriendRequest(user.id, userId);
    return NextResponse.json(friendship, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
