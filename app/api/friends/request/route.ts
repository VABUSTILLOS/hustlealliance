import { NextRequest, NextResponse } from "next/server";
import { sendFriendRequest, getFriendRequests } from "@/lib/db/social";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/friends/request — list pending requests (incoming or outgoing)
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const direction = (searchParams.get("direction") as "incoming" | "outgoing") ?? "incoming";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const cursor = searchParams.get("cursor") ?? undefined;

    const requests = await getFriendRequests(user.id, direction, limit, cursor);
    return NextResponse.json(requests);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/friends/request — send friend request
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (user.id === userId) {
      return NextResponse.json({ error: "Cannot send friend request to yourself" }, { status: 400 });
    }

    const friendship = await sendFriendRequest(user.id, userId);
    return NextResponse.json(friendship, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
