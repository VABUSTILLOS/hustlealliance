import prisma from "@/lib/db/prisma";
import type { PostVisibility } from "@/lib/generated/prisma/client";

// ── Create (with mention parsing) ──────────────────────────────────────

export async function createPost(params: {
  authorId: string;
  content: string;
  imageUrls?: string[];
  visibility?: PostVisibility;
  groupId?: string;
  space?: string;
}) {
  const post = await prisma.communityPost.create({
    data: {
      authorId: params.authorId,
      content: params.content,
      imageUrls: params.imageUrls ?? [],
      visibility: params.visibility ?? "PUBLIC",
      groupId: params.groupId ?? null,
      space: params.space ?? null,
    },
    select: {
      id: true,
      content: true,
      authorId: true,
      space: true,
      imageUrls: true,
      isPinned: true,
      isEdited: true,
      visibility: true,
      groupId: true,
      createdAt: true,
      author: { select: { id: true, name: true, username: true, avatar: true } },
    },
  });
  return post;
}

// ── Read (with pagination, filtering) ──────────────────────────────────

export async function getFeedPosts(params: {
  userId?: string;
  space?: string;
  groupId?: string;
  visibility?: PostVisibility;
  limit?: number;
  cursor?: string;
}) {
  const { space, groupId, visibility, limit = 20, cursor } = params;

  const where: Record<string, unknown> = {};
  if (space) where.space = space;
  if (groupId) where.groupId = groupId;
  if (visibility) where.visibility = visibility;

  return prisma.communityPost.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { likes: true, comments: true } },
    },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });
}

export async function getPostById(postId: string) {
  return prisma.communityPost.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      likes: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      comments: {
        include: {
          author: { select: { id: true, name: true, username: true, avatar: true } },
          likes: { include: { user: { select: { id: true, name: true } } } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getUserPosts(userId: string, limit = 20, cursor?: string) {
  return prisma.communityPost.findMany({
    where: { authorId: userId },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { likes: true, comments: true } },
    },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}

// ── Update ──────────────────────────────────────────────────────────────

export async function updatePost(postId: string, authorId: string, data: {
  content?: string;
  imageUrls?: string[];
  visibility?: PostVisibility;
  isPinned?: boolean;
}) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, authorId },
  });
  if (!post) throw new Error("Post not found or unauthorized");

  return prisma.communityPost.update({
    where: { id: postId },
    data: { ...data, isEdited: true, editedAt: new Date() },
  });
}

// ── Delete ──────────────────────────────────────────────────────────────

export async function deletePost(postId: string, authorId: string) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, authorId },
  });
  if (!post) throw new Error("Post not found or unauthorized");

  return prisma.communityPost.delete({ where: { id: postId } });
}

// ── Likes ───────────────────────────────────────────────────────────────

export async function likePost(postId: string, userId: string) {
  return prisma.postLike.create({
    data: { postId, userId },
  });
}

export async function unlikePost(postId: string, userId: string) {
  return prisma.postLike.delete({
    where: { postId_userId: { postId, userId } },
  });
}

export async function getPostLikes(postId: string, limit = 50) {
  return prisma.postLike.findMany({
    where: { postId },
    include: { user: { select: { id: true, name: true, username: true, avatar: true } } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

// ── Pinning ─────────────────────────────────────────────────────────────

export async function togglePinPost(postId: string, authorId: string) {
  const post = await prisma.communityPost.findFirst({ where: { id: postId, authorId } });
  if (!post) throw new Error("Post not found or unauthorized");

  return prisma.communityPost.update({
    where: { id: postId },
    data: { isPinned: !post.isPinned },
  });
}
