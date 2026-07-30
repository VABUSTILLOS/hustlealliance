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

  const post = await getPostById(postId);

  if (!post || post.isDeleted) {
    notFound();
  }

  // Fetch comments (up to 50)
  const initialComments = await getCommentsForPost(postId);

  // Fetch 3 related posts from same space
  const relatedPosts = await prisma.communityPost.findMany({
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
