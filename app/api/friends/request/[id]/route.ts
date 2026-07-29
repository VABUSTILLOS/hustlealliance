import { NextRequest, NextResponse } from "next/server";
import { acceptFriendRequest, rejectFriendRequest } from "@/lib/db/social";
import { getCurrentUser } from "@/lib/auth/user";

// PUT /api/friends/request/[id] — accept or reject a friend request
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { action } = await req.json();

    if (action === "accept") {
      const friendship = await acceptFriendRequest(id);
      return NextResponse.json(friendship);
    }

    if (action === "reject") {
      const friendship = await rejectFriendRequest(id);
      return NextResponse.json(friendship);
    }

    return NextResponse.json({ error: "action must be 'accept' or 'reject'" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
