import { NextRequest, NextResponse } from "next/server";
import { createPost, getFeedPosts } from "@/lib/db/posts";
import { fanoutToFollowers } from "@/lib/db/feed";
import { getCurrentUser } from "@/lib/auth/user";
import { extractMentions } from "@/lib/mentions/parser";
import { notifyMentioned } from "@/lib/notifications/service";
import prisma from "@/lib/db/prisma";

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

    // Fanout to followers for global visibility posts
    if (post.visibility === "PUBLIC" && !post.groupId) {
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
