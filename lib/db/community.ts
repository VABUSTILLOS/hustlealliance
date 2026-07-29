import { cache } from 'react';
import prisma from '@/lib/db/prisma';

// ── Return types (matching existing FeedPost / Community shapes) ──

export interface CommunityPostAuthor {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

export interface CommunityPostItem {
  id: string;
  author: CommunityPostAuthor;
  content: string;
  space: string | null;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  shareCount: number;
  isPinned: boolean;
  isEdited: boolean;
  imageUrls: string[];
}

export interface CommunityCommentItem {
  id: string;
  author: CommunityPostAuthor;
  content: string;
  createdAt: string;
}

export interface GetCommunityPostsOpts {
  sort?: 'latest' | 'popular';
  cursor?: string;
  limit?: number;
  space?: string;
}

export interface GetCommunityPostsResult {
  items: CommunityPostItem[];
  hasMore: boolean;
  nextCursor: string | null;
}

// ── Data access functions ──

/**
 * Fetch community posts with cursor-based pagination.
 * Wrapped with React's cache() so repeated calls in the same request are deduplicated.
 */
export const getCommunityPosts = cache(
  async (opts: GetCommunityPostsOpts = {}): Promise<GetCommunityPostsResult> => {
    const { sort = 'latest', cursor, limit = 20, space } = opts;

    // Fetch limit+1 to determine if there are more items
    const take = limit + 1;

    const where: Record<string, unknown> = { isDeleted: false };
    if (space) where.space = space;

    const posts = await prisma.communityPost.findMany({
      where,
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy:
        sort === 'popular'
          ? { comments: { _count: 'desc' } }
          : { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        _count: { select: { comments: true, likes: true, shares: true } },
      },
    });

    const hasMore = posts.length > limit;
    const items = (hasMore ? posts.slice(0, limit) : posts).map((post) => ({
      id: post.id,
      author: {
        id: post.author.id,
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar,
      },
      content: post.content,
      space: post.space,
      createdAt: post.createdAt.toISOString(),
      commentCount: post._count.comments,
      likeCount: post._count.likes,
      shareCount: post._count.shares,
      isPinned: post.isPinned,
      isEdited: post.isEdited,
      imageUrls: post.imageUrls,
    }));

    const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

    return { items, hasMore, nextCursor };
  },
);

/**
 * Fetch comments for a specific post (up to 50).
 */
export const getCommentsForPost = cache(
  async (postId: string): Promise<CommunityCommentItem[]> => {
    const comments = await prisma.communityComment.findMany({
      where: { postId },
      take: 50,
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      author: {
        id: comment.author.id,
        name: comment.author.name,
        username: comment.author.username,
        avatar: comment.author.avatar,
      },
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    }));
  },
);

// ── Trending ──

export interface TrendingTopic {
  space: string;
  postCount: number;
  commentCount: number;
}

/**
 * Returns the top active spaces from the last 7 days.
 * Wrapped with cache() so parallel calls in the same request are deduplicated.
 */
export const getTrendingTopics = cache(
  async (limit = 5): Promise<TrendingTopic[]> => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const rows = await prisma.communityPost.groupBy({
      by: ['space'],
      where: {
        space: { not: null },
        createdAt: { gte: sevenDaysAgo },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    const spaces = rows.map((r) => r.space as string);

    // Fetch comment counts per space
    const commentData = await Promise.all(
      spaces.map(async (space) => {
        const count = await prisma.communityComment.count({
          where: {
            post: { space },
            createdAt: { gte: sevenDaysAgo },
          },
        });
        return { space, commentCount: count };
      }),
    );

    const commentMap = new Map(commentData.map((d) => [d.space, d.commentCount]));

    return rows.map((row) => ({
      space: row.space as string,
      postCount: row._count.id,
      commentCount: commentMap.get(row.space as string) ?? 0,
    }));
  },
);

// ── Pinned Posts ──────────────────────────────────────────────────────

export const getPinnedPosts = cache(
  async (spaceId?: string) => {
    const where: Record<string, unknown> = {
      isPinned: true,
      isDeleted: false,
    };
    if (spaceId) where.space = spaceId;

    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { likes: true, comments: true, shares: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map((post) => ({
      id: post.id,
      author: {
        id: post.author.id,
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar,
      },
      content: post.content,
      space: post.space,
      createdAt: post.createdAt.toISOString(),
      commentCount: post._count.comments,
      likeCount: post._count.likes,
      shareCount: post._count.shares,
      isPinned: post.isPinned,
      isEdited: post.isEdited,
      imageUrls: post.imageUrls,
    }));
  },
);

// ── Post Detail (cached) ──────────────────────────────────────────────

export interface PostDetail {
  id: string;
  author: CommunityPostAuthor;
  content: string;
  space: string | null;
  imageUrls: string[];
  isPinned: boolean;
  isEdited: boolean;
  editedAt: string | null;
  visibility: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

export const getPostDetailCached = cache(
  async (postId: string): Promise<PostDetail | null> => {
    const post = await prisma.communityPost.findFirst({
      where: { id: postId, isDeleted: false },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { likes: true, comments: true, shares: true } },
      },
    });

    if (!post) return null;

    return {
      id: post.id,
      author: {
        id: post.author.id,
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar,
      },
      content: post.content,
      space: post.space,
      imageUrls: post.imageUrls,
      isPinned: post.isPinned,
      isEdited: post.isEdited,
      editedAt: post.editedAt?.toISOString() ?? null,
      visibility: post.visibility,
      createdAt: post.createdAt.toISOString(),
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      shareCount: post._count.shares,
    };
  },
);
