import { NextRequest, NextResponse } from "next/server";
import { likePost, unlikePost } from "@/lib/db/posts";
import { getCurrentUser } from "@/lib/auth/user";
import { fanoutToFollowers } from "@/lib/db/feed";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await likePost(id, user.id);

    // Fanout POST_LIKED to followers
    fanoutToFollowers({
      actorId: user.id,
      type: "POST_LIKED",
      entityType: "Post",
      entityId: id,
    }).catch(() => {});

    return NextResponse.json({ liked: true });
  } catch {
    return NextResponse.json({ error: "Already liked" }, { status: 409 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await unlikePost(id, user.id);
    return NextResponse.json({ liked: false });
  } catch {
    return NextResponse.json({ error: "Not liked" }, { status: 404 });
  }
}
