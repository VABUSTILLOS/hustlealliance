import { NextRequest, NextResponse } from "next/server";
import { followUser, unfollowUser, isFollowing } from "@/lib/db/social";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/users/[id]/follow — follow a user
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;

    if (user.id === id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    await followUser(user.id, id);
    return NextResponse.json({ following: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/users/[id]/follow — unfollow a user
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await unfollowUser(user.id, id);
    return NextResponse.json({ following: false });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// GET /api/users/[id]/follow — check follow status
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const following = await isFollowing(user.id, id);
    return NextResponse.json({ following });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
