import { NextRequest, NextResponse } from "next/server";
import { followUser, unfollowUser, getFollowers, getFollowing } from "@/lib/db/social";
import { getCurrentUser } from "@/lib/auth/user";
import prisma from "@/lib/db/prisma";

// GET /api/social/followers?userId=...&limit=20&cursor=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId")!;
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const cursor = searchParams.get("cursor") ?? undefined;
  const type = searchParams.get("type") ?? "followers";

  try {
    const data = type === "following"
      ? await getFollowing(userId, limit, cursor)
      : await getFollowers(userId, limit, cursor);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/social/follow — { followedId }
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { followedId } = await req.json();
    await followUser(user.id, followedId);

    // Insert feed item for the followed user
    prisma.feedItem.create({
      data: {
        ownerId: followedId,
        actorId: user.id,
        type: "USER_FOLLOWED",
        entityType: "User",
        entityId: user.id,
      },
    }).catch(() => {});

    return NextResponse.json({ following: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/social/follow — { followedId }
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { followedId } = await req.json();
    await unfollowUser(user.id, followedId);
    return NextResponse.json({ following: false });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
