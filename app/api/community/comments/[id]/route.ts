import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";

async function getOwnedComment(id: string, userId: string) {
  const comment = await prisma.communityComment.findUnique({
    where: { id },
    select: { id: true, authorId: true, postId: true },
  });
  if (!comment) return { error: "Comment not found", status: 404 as const };
  if (comment.authorId !== userId) return { error: "Forbidden", status: 403 as const };
  return { comment };
}

// PATCH /api/community/comments/[id] — edit own comment
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const owned = await getOwnedComment(id, user.id);
    if ("error" in owned) return NextResponse.json({ error: owned.error }, { status: owned.status });

    const { content } = await req.json();
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }
    if (content.length > 2000) {
      return NextResponse.json({ error: "Content too long" }, { status: 400 });
    }

    const updated = await prisma.communityComment.update({
      where: { id },
      data: { content: content.trim(), editedAt: new Date() },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { likes: true } },
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/community/comments/[id] — delete own comment (replies cascade)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const owned = await getOwnedComment(id, user.id);
    if ("error" in owned) return NextResponse.json({ error: owned.error }, { status: owned.status });

    await prisma.communityComment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
