import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

interface MediaItem {
  postId: string;
  url: string;
  createdAt: Date;
  author: { name: string | null };
}

// GET /api/groups/[id]/media — all images shared in group posts, newest first
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "60"), 200);

    const posts = await prisma.communityGroupPost.findMany({
      where: { groupId: id, NOT: { imageUrls: { isEmpty: true } } },
      select: {
        id: true,
        imageUrls: true,
        createdAt: true,
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const items: MediaItem[] = posts.flatMap((p) =>
      p.imageUrls.map((u) => ({
        postId: p.id,
        url: u,
        createdAt: p.createdAt,
        author: p.author,
      })),
    );

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
