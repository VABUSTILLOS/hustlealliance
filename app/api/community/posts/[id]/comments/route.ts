import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";
import { notifyCommentAdded } from "@/lib/notifications/service";
import { fanoutToFollowers } from "@/lib/db/feed";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;

  try {
    const comments = await prisma.communityComment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { likes: true } },
      },
      take: 50,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;

  try {
    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    const comment = await prisma.communityComment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: user.id,
      },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { likes: true } },
      },
    });

    // Fire-and-forget: notify post author
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { authorId: true, author: { select: { email: true } } },
    });
    if (post && post.authorId !== user.id) {
      notifyCommentAdded(
        post.authorId,
        post.author.email,
        user.name ?? "Someone",
        postId,
        content.slice(0, 100)
      ).catch(() => {});
    }

    // Fanout COMMENT_CREATED to followers
    fanoutToFollowers({
      actorId: user.id,
      type: "COMMENT_CREATED",
      entityType: "Comment",
      entityId: comment.id,
      metadata: { postId, preview: content.slice(0, 150) },
    }).catch(() => {});

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
