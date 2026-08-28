import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getMemberRole } from "@/lib/db/groups";
import { createPost } from "@/lib/db/posts";
import { getCurrentUser } from "@/lib/auth/user";
import { notifyGroupAnnouncement } from "@/lib/notifications/service";
import { syncPostHashtags } from "@/lib/hashtags/parser";

// POST /api/groups/[id]/announce
// Group OWNER/ADMIN publishes an announcement: a pinned group post plus a
// GROUP_ANNOUNCEMENT notification to every ACTIVE member.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const role = await getMemberRole(id, user.id);
    if (role !== "OWNER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content } = await req.json();
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }
    if (content.length > 5000) {
      return NextResponse.json({ error: "content too long" }, { status: 400 });
    }

    const group = await prisma.communityGroup.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    });
    if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

    const post = await createPost({
      authorId: user.id,
      content: content.trim(),
      groupId: group.id,
      visibility: "PUBLIC",
    });
    await prisma.communityPost.update({
      where: { id: post.id },
      data: { isPinned: true },
    });

    syncPostHashtags(post.id, content).catch(() => {});

    // Notify all active members (except the announcer) in chunks
    const members = await prisma.communityGroupMember.findMany({
      where: { groupId: group.id, status: "ACTIVE", userId: { not: user.id } },
      select: { userId: true, user: { select: { id: true, email: true } } },
    });

    const groupUrl = `/groups/${group.slug}`;
    for (let i = 0; i < members.length; i += 10) {
      await Promise.all(
        members.slice(i, i + 10).map((m) =>
          notifyGroupAnnouncement(
            m.user.id,
            m.user.email ?? "",
            group.name,
            group.id,
            group.slug,
            content.trim(),
            post.id,
          ).catch((err) =>
            console.error(`[Groups] Announcement notification failed for ${m.userId}:`, err),
          ),
        ),
      );
    }

    return NextResponse.json({ post: { ...post, isPinned: true }, notified: members.length, groupUrl }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
