import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;

  try {
    // Get the current post's space
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { space: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Posts without a space have no meaningful "related" set
    if (!post.space) {
      return NextResponse.json([], {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }

    // Fetch related posts from the same space, excluding current post
    const related = await prisma.communityPost.findMany({
      where: {
        space: post.space,
        id: { not: postId },
        isDeleted: false,
      },
      select: {
        id: true,
        content: true,
        excerpt: true,
        imageUrls: true,
        space: true,
        createdAt: true,
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(related, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
