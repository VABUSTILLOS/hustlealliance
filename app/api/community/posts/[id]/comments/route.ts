import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";
import { notifyCommentAdded, notifyMentioned } from "@/lib/notifications/service";
import { extractMentions } from "@/lib/mentions/parser";
import { fanoutToFollowers } from "@/lib/db/feed";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const user = await getCurrentUser();

  try {
    const comments = await prisma.communityComment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { likes: true } },
        ...(user
          ? {
              likes: {
                where: { userId: user.id },
                select: { type: true },
                take: 1,
              },
            }
          : {}),
      },
      take: 50,
      orderBy: { createdAt: "asc" },
    });

    const payload = comments.map((c) => {
      const { likes, ...rest } = c as typeof c & { likes?: { type: string }[] };
      return { ...rest, myReaction: likes?.[0]?.type ?? null };
    });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, no-cache",
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
    const { content, parentId } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    // Validate reply target: must exist, belong to this post, and be top-level
    // (one level of threading only).
    let parent: { id: string; authorId: string; author: { email: string | null } } | null = null;
    if (parentId && typeof parentId === "string") {
      const found = await prisma.communityComment.findFirst({
        where: { id: parentId, postId },
        select: { id: true, authorId: true, parentId: true, author: { select: { email: true } } },
      });
      if (!found) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }
      if (found.parentId) {
        return NextResponse.json({ error: "Cannot reply to a reply" }, { status: 400 });
      }
      parent = found;
    }

    const post = await prisma.communityPost.findFirst({
      where: { id: postId, isDeleted: false },
      select: { authorId: true, author: { select: { email: true } } },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await prisma.communityComment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: user.id,
        ...(parent ? { parentId: parent.id } : {}),
      },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { likes: true } },
      },
    });

    // Fire-and-forget: notify post author
    if (post.authorId !== user.id) {
      notifyCommentAdded(
        post.authorId,
        post.author.email,
        user.name ?? "Someone",
        postId,
        content.slice(0, 100)
      ).catch(() => {});
    }

    // Fire-and-forget: notify parent comment author on replies
    if (parent && parent.authorId !== user.id && parent.authorId !== post.authorId) {
      notifyCommentAdded(
        parent.authorId,
        parent.author.email ?? "",
        user.name ?? "Someone",
        postId,
        content.slice(0, 100)
      ).catch(() => {});
    }

    // Extract and persist mentions
    const mentions = extractMentions(content);
    if (mentions.length > 0) {
      const mentionedUsers = await prisma.user.findMany({
        where: { username: { in: mentions, mode: "insensitive" } },
        select: { id: true, username: true, email: true },
      });

      if (mentionedUsers.length > 0) {
        await prisma.mention.createMany({
          data: mentionedUsers.map((u) => ({
            entityType: "COMMENT" as const,
            entityId: comment.id,
            userId: u.id,
            mentionedBy: user.id,
          })),
        });

        for (const u of mentionedUsers) {
          if (u.id !== user.id) {
            notifyMentioned(
              u.id,
              u.email,
              user.name ?? "Someone",
              postId,
              "Comment"
            ).catch(() => {});
          }
        }
      }
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
