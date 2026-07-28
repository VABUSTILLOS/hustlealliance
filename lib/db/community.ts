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

    const where = space ? { space } : {};

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
        _count: { select: { comments: true } },
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
