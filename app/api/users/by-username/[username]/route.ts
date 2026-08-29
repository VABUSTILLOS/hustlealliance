import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { isFollowing, getFollowerCount, getFollowingCount } from "@/lib/db/social";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/users/by-username/[username] — profile social summary
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
      select: { id: true, name: true, username: true, avatar: true, headline: true },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const current = await getCurrentUser();
    const [followers, following, isFollowingMe] = await Promise.all([
      getFollowerCount(user.id),
      getFollowingCount(user.id),
      current && current.id !== user.id ? isFollowing(current.id, user.id) : false,
    ]);

    return NextResponse.json({ user, followers, following, isFollowing: !!isFollowingMe });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
