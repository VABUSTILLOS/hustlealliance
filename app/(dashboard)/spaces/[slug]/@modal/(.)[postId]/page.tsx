import { notFound } from "next/navigation";
import { getPostById } from "@/lib/db/posts";
import { getCommentsForPost } from "@/lib/db/community";
import prisma from "@/lib/db/prisma";
import { PostDetailClient } from "../../[postId]/PostDetailClient";
import { PostModal } from "./PostModalClient";

interface PageProps {
  params: Promise<{ slug: string; postId: string }>;
}

export default async function PostInterceptPage({ params }: PageProps) {
  const { slug, postId } = await params;

  let post;
  try {
    post = await getPostById(postId);
  } catch (err) {
    console.error('[post-modal] Failed to load post:', (err as Error).message);
    notFound();
  }
  if (!post || post.isDeleted) notFound();

  let initialComments: Awaited<ReturnType<typeof getCommentsForPost>> = [];
  try {
    initialComments = await getCommentsForPost(postId);
  } catch (err) {
    console.error('[post-modal] Failed to load comments:', (err as Error).message);
  }

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
    console.error('[post-modal] Failed to load related posts:', (err as Error).message);
  }

  const { title } = extractTitle(post.content);

  return (
    <PostModal title={title}>
      <PostDetailClient
        postId={postId}
        spaceSlug={slug}
        post={JSON.parse(JSON.stringify(post))}
        initialComments={JSON.parse(JSON.stringify(initialComments))}
        relatedPosts={JSON.parse(JSON.stringify(relatedPosts))}
      />
    </PostModal>
  );
}

function extractTitle(content: string): { title: string; body: string } {
  const match = content.match(/^## (.+?)(?:\n\n|$)/);
  if (match) {
    return { title: match[1], body: content.slice(match[0].length) };
  }
  return { title: content.split("\n")[0].slice(0, 100), body: content };
}
