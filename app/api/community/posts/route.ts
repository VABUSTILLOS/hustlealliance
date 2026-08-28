import { NextRequest, NextResponse } from "next/server";
import { createPost, getFeedPosts } from "@/lib/db/posts";
import { fanoutToFollowers, fanoutToGroupMembers } from "@/lib/db/feed";
import { getCurrentUser } from "@/lib/auth/user";
import { extractMentions } from "@/lib/mentions/parser";
import { syncPostHashtags } from "@/lib/hashtags/parser";
import { notifyMentioned } from "@/lib/notifications/service";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const space = searchParams.get("space") ?? undefined;
  const groupId = searchParams.get("groupId") ?? undefined;
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const tag = searchParams.get("tag") ?? undefined;

  try {
    const posts = await getFeedPosts({ space, groupId, cursor, limit, tag });
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
    const { poll, ...postData } = body;
    const post = await createPost({ ...postData, authorId: user.id });

    // Index hashtags (fire-and-forget)
    syncPostHashtags(post.id, post.content).catch(() => {});

    // Attach a poll when the post includes one (Mighty Networks-style poll posts)
    if (poll?.question && Array.isArray(poll.options)) {
      const options = poll.options
        .filter((o: unknown): o is string => typeof o === "string" && o.trim().length > 0)
        .slice(0, 4);
      if (options.length >= 2) {
        await prisma.poll.create({
          data: {
            postId: post.id,
            question: String(poll.question).trim(),
            expiresAt: poll.expiresAt ? new Date(poll.expiresAt) : null,
            options: {
              create: options.map((text: string, i: number) => ({ text: text.trim(), order: i })),
            },
          },
        });
      }
    }

    // Extract and persist mentions
    const mentions = extractMentions(body.content ?? "");
    if (mentions.length > 0) {
      const mentionedUsers = await prisma.user.findMany({
        where: { username: { in: mentions, mode: "insensitive" } },
        select: { id: true, username: true, email: true },
      });

      if (mentionedUsers.length > 0) {
        // Batch insert mention records
        await prisma.mention.createMany({
          data: mentionedUsers.map((u) => ({
            entityType: "POST" as const,
            entityId: post.id,
            userId: u.id,
            mentionedBy: user.id,
          })),
        });

        // Notify mentioned users (fire-and-forget)
        for (const u of mentionedUsers) {
          if (u.id !== user.id) {
            notifyMentioned(
              u.id,
              u.email,
              user.name ?? "Someone",
              post.id,
              "Post"
            ).catch(() => {});
          }
        }
      }
    }

    // Fanout: group posts → group members; public posts → followers
    if (post.groupId) {
      fanoutToGroupMembers({
        groupId: post.groupId,
        actorId: user.id,
        type: "POST_CREATED",
        entityType: "Post",
        entityId: post.id,
        metadata: { preview: post.content.slice(0, 150) },
      }).catch(() => {});
    } else if (post.visibility === "PUBLIC") {
      fanoutToFollowers({
        actorId: user.id,
        type: "POST_CREATED",
        entityType: "Post",
        entityId: post.id,
        metadata: { preview: post.content.slice(0, 150) },
      }).catch(() => {});
    }

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
