import { notFound } from "next/navigation";
import { getPostById } from "@/lib/db/posts";
import { getCommentsForPost } from "@/lib/db/community";
import prisma from "@/lib/db/prisma";
import { PostDetailClient } from "./PostDetailClient";

interface PageProps {
  params: Promise<{ slug: string; postId: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug, postId } = await params;

  let post;
  try {
    post = await getPostById(postId);
  } catch (err) {
    console.error('[post-detail] Failed to load post:', (err as Error).message);
    notFound();
  }

  if (!post || post.isDeleted) {
    notFound();
  }

  // Fetch comments (up to 50)
  let initialComments: Awaited<ReturnType<typeof getCommentsForPost>> = [];
  try {
    initialComments = await getCommentsForPost(postId);
  } catch (err) {
    console.error('[post-detail] Failed to load comments:', (err as Error).message);
  }

  // Fetch 3 related posts from same space
  let relatedPosts: any[] = [];
  try {
    relatedPosts = await prisma.communityPost.findMany({
      where: {
        space: slug,
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
  } catch (err) {
    console.error('[post-detail] Failed to load related posts:', (err as Error).message);
  }

  return (
    <PostDetailClient
      postId={postId}
      spaceSlug={slug}
      post={JSON.parse(JSON.stringify(post))}
      initialComments={JSON.parse(JSON.stringify(initialComments))}
      relatedPosts={JSON.parse(JSON.stringify(relatedPosts))}
    />
  );
}
