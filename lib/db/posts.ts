import prisma from "@/lib/db/prisma";
import { normalizeAvatarUrl } from "@/lib/utils/avatar";
import type { PostVisibility, ReactionType } from "@/lib/generated/prisma/client";
import { reactToPost, unreactToPost } from "@/lib/db/reactions";

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
  const { userId, space, groupId, visibility, limit = 20, cursor } = params;

  const where: Record<string, unknown> = { isDeleted: false };
  if (space) where.space = space;
  if (groupId) where.groupId = groupId;
  if (visibility) where.visibility = visibility;

  const posts = await prisma.communityPost.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { likes: true, comments: true } },
      poll: {
        include: {
          options: {
            orderBy: { order: "asc" },
            include: { _count: { select: { votes: true } } },
          },
          ...(userId
            ? {
                votes: {
                  where: { userId },
                  select: { optionId: true },
                  take: 1,
                },
              }
            : {}),
        },
      },
    },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return posts.map((post) => {
    const poll = post.poll;
    return {
      ...post,
      poll: poll
        ? {
            id: poll.id,
            question: poll.question,
            expiresAt: poll.expiresAt?.toISOString() ?? null,
            totalVotes: poll.options.reduce((sum, o) => sum + o._count.votes, 0),
            myVoteOptionId:
              (poll as { votes?: { optionId: string }[] }).votes?.[0]?.optionId ?? null,
            options: poll.options.map((o) => ({ id: o.id, text: o.text, votes: o._count.votes })),
          }
        : null,
    };
  });
}

export async function getPostById(postId: string) {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { likes: true, comments: true } },
      likes: {
        take: 20,
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
      poll: {
        include: {
          options: {
            orderBy: { order: "asc" },
            include: { _count: { select: { votes: true } } },
          },
        },
      },
      comments: {
        take: 50,
        include: {
          author: { select: { id: true, name: true, username: true, avatar: true } },
          _count: { select: { likes: true } },
          likes: {
            take: 5,
            include: { user: { select: { id: true, name: true } } },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) return null;

  return {
    ...post,
    author: {
      ...post.author,
      avatar: normalizeAvatarUrl(post.author.avatar),
    },
    comments: post.comments.map((c) => ({
      ...c,
      author: {
        ...c.author,
        avatar: normalizeAvatarUrl(c.author.avatar),
      },
    })),
  };
}

export async function getUserPosts(userId: string, limit = 20, cursor?: string) {
  return prisma.communityPost.findMany({
    where: { authorId: userId, isDeleted: false },
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

const EDIT_WINDOW_HOURS = 24;

export async function updatePost(postId: string, authorId: string, data: {
  content?: string;
  imageUrls?: string[];
  visibility?: PostVisibility;
  isPinned?: boolean;
}) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, authorId, isDeleted: false },
  });
  if (!post) throw new Error("Post not found or unauthorized");

  // Check edit window
  const hoursSinceCreation =
    (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);
  if (hoursSinceCreation > EDIT_WINDOW_HOURS) {
    throw new Error(`Posts can only be edited within ${EDIT_WINDOW_HOURS} hours of posting`);
  }

  return prisma.communityPost.update({
    where: { id: postId },
    data: { ...data, isEdited: true, editedAt: new Date() },
  });
}

// ── Delete (soft-delete) ────────────────────────────────────────────────

export async function deletePost(postId: string, authorId: string) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, authorId, isDeleted: false },
  });
  if (!post) throw new Error("Post not found or unauthorized");

  return prisma.communityPost.update({
    where: { id: postId },
    data: { isDeleted: true, deletedAt: new Date() },
  });
}

// ── Likes ───────────────────────────────────────────────────────────────

export async function likePost(postId: string, userId: string, type: ReactionType = 'LIKE') {
  return reactToPost(postId, userId, type);
}

export async function unlikePost(postId: string, userId: string) {
  return unreactToPost(postId, userId);
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
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, authorId, isDeleted: false },
  });
  if (!post) throw new Error("Post not found or unauthorized");

  return prisma.communityPost.update({
    where: { id: postId },
    data: { isPinned: !post.isPinned },
  });
}

export async function getPinnedPosts(spaceId?: string) {
  const where: Record<string, unknown> = {
    isPinned: true,
    isDeleted: false,
  };
  if (spaceId) where.space = spaceId;

  return prisma.communityPost.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { likes: true, comments: true, shares: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ── Shares ──────────────────────────────────────────────────────────────

export async function sharePost(postId: string, userId: string, content?: string) {
  // Verify post exists and is not deleted
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, isDeleted: false },
  });
  if (!post) throw new Error("Post not found");

  return prisma.communityShare.create({
    data: { postId, userId, content },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, name: true, username: true, avatar: true } },
    },
  });
}

// ── Reports ─────────────────────────────────────────────────────────────

export async function reportPost(postId: string, userId: string, reason: string) {
  // Verify post exists and is not deleted
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, isDeleted: false },
  });
  if (!post) throw new Error("Post not found");

  return prisma.communityReport.upsert({
    where: { postId_userId: { postId, userId } },
    create: { postId, userId, reason },
    update: { reason },
  });
}

// ── Post Image ──────────────────────────────────────────────────────────

export async function uploadPostImage(postId: string, imageUrl: string) {
  return prisma.communityPost.update({
    where: { id: postId },
    data: { imageUrls: { push: imageUrl } },
  });
}

// ── Search ──────────────────────────────────────────────────────────────

export async function searchPosts(query: string, filters?: {
  space?: string;
  authorId?: string;
  limit?: number;
  cursor?: string;
}) {
  const { space, authorId, limit = 20, cursor } = filters ?? {};

  const where: Record<string, unknown> = {
    isDeleted: false,
    content: { contains: query, mode: "insensitive" },
  };
  if (space) where.space = space;
  if (authorId) where.authorId = authorId;

  return prisma.communityPost.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { likes: true, comments: true, shares: true } },
    },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}

// ── Post Detail (enriched) ──────────────────────────────────────────────

export async function getPostDetail(postId: string) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, isDeleted: false },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      likes: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      _count: { select: { likes: true, comments: true, shares: true } },
    },
  });

  if (!post) return null;

  return {
    ...post,
    author: {
      ...post.author,
      avatar: normalizeAvatarUrl(post.author.avatar),
    },
  };
}
