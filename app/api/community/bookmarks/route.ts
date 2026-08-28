import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";
import { normalizeAvatarUrl } from "@/lib/utils/avatar";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const bookmarks = await prisma.postBookmark.findMany({
      where: { userId: user.id, post: { isDeleted: false } },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        post: {
          include: {
            author: { select: { id: true, name: true, username: true, avatar: true } },
            _count: { select: { comments: true, likes: true, shares: true } },
          },
        },
      },
    });

    const items = bookmarks.map((b) => ({
      bookmarkedAt: b.createdAt.toISOString(),
      id: b.post.id,
      author: {
        id: b.post.author.id,
        name: b.post.author.name,
        username: b.post.author.username,
        avatar: normalizeAvatarUrl(b.post.author.avatar),
      },
      content: b.post.content,
      excerpt: b.post.excerpt,
      locale: b.post.locale,
      space: b.post.space,
      createdAt: b.post.createdAt.toISOString(),
      commentCount: b.post._count.comments,
      likeCount: b.post._count.likes,
      shareCount: b.post._count.shares,
      isPinned: b.post.isPinned,
      isEdited: b.post.isEdited,
      imageUrls: b.post.imageUrls,
      isBookmarked: true,
    }));

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

    await prisma.postBookmark.upsert({
      where: { postId_userId: { postId, userId: user.id } },
      create: { postId, userId: user.id },
      update: {},
    });
    return NextResponse.json({ bookmarked: true });
  } catch {
    return NextResponse.json({ error: "Failed to bookmark" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

    await prisma.postBookmark.delete({
      where: { postId_userId: { postId, userId: user.id } },
    });
    return NextResponse.json({ bookmarked: false });
  } catch {
    return NextResponse.json({ error: "Not bookmarked" }, { status: 404 });
  }
}
