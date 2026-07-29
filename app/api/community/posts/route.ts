import { NextRequest, NextResponse } from "next/server";
import { createPost, getFeedPosts } from "@/lib/db/posts";
import { fanoutToFollowers } from "@/lib/db/feed";
import { getCurrentUser } from "@/lib/auth/user";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const space = searchParams.get("space") ?? undefined;
  const groupId = searchParams.get("groupId") ?? undefined;
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    const posts = await getFeedPosts({ space, groupId, cursor, limit });
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const post = await createPost({ ...body, authorId: user.id });

    // Fanout to followers for global visibility posts
    if (post.visibility === "PUBLIC" && !post.groupId) {
      fanoutToFollowers({
        actorId: user.id,
        type: "POST_CREATED",
        entityType: "Post",
        entityId: post.id,
        metadata: { preview: post.content.slice(0, 150) },
      }).catch(() => {}); // fire-and-forget
    }

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
