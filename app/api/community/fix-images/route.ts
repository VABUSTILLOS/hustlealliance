import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token !== "ha-fix-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.communityPost.findMany({
    where: { imageUrls: { isEmpty: false } },
    select: { id: true },
  });

  let updated = 0;
  for (const post of posts) {
    await prisma.communityPost.update({
      where: { id: post.id },
      data: {
        imageUrls: [`https://picsum.photos/seed/post-${post.id}/800/600.webp`],
      },
    });
    updated++;
  }

  return NextResponse.json({
    success: true,
    updated,
    sample: posts.length > 0
      ? `https://picsum.photos/seed/post-${posts[0].id}/800/600.webp`
      : null,
  });
}
