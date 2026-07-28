'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { LazyMotionDiv, LazyAnimatePresence } from '@/lib/framer/lazy-motion';
import { useCommunityFeed } from './useCommunityFeed';
import type { CommunityPostItem } from '@/lib/db/community';

interface PostFeedUIProps {
  initialPosts: CommunityPostItem[];
  initialHasMore: boolean;
  initialCursor: string | null;
  sort?: 'latest' | 'popular';
}

export const PostFeedUI = memo(function PostFeedUI({
  initialPosts,
  initialHasMore,
  initialCursor,
  sort = 'latest',
}: PostFeedUIProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunityFeed({
    sort,
    initialData: initialPosts.length
      ? {
          pages: [{ items: initialPosts, hasMore: initialHasMore, nextCursor: initialCursor }],
          pageParams: [undefined],
        }
      : undefined,
  });

  const posts = data?.pages.flatMap((page) => page.items) ?? initialPosts;

  if (posts.length === 0) {
    return (
      <LazyMotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4"
      >
        <div className="text-6xl mb-4">💬</div>
        <h2 className="font-display text-2xl text-[var(--color-foreground)] uppercase mb-3">
          No posts yet
        </h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mb-6 max-w-md mx-auto">
          Be the first to share something with the community!
        </p>
      </LazyMotionDiv>
    );
  }

  return (
    <div className="space-y-4">
      <LazyAnimatePresence>
        {posts.map((post) => (
          <LazyMotionDiv
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-surface border border-surface-light rounded-2xl p-5"
          >
            {/* Author row */}
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={post.author.avatar ?? `https://api.dicebear.com/9.x/initials/svg?seed=${post.author.name}`}
                alt=""
                width={40}
                height={40}
                className="rounded-full border border-white/10 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-foreground text-sm">{post.author.name}</p>
                <p className="font-mono text-[10px] text-muted">@{post.author.username}</p>
              </div>
              {post.space && (
                <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono uppercase">
                  {post.space}
                </span>
              )}
            </div>

            {/* Content */}
            <p className="text-foreground-muted text-sm mb-3 leading-relaxed">{post.content}</p>

            {/* Actions bar */}
            <div className="flex items-center gap-4">
              <span className={clsx('text-xs font-mono text-muted')}>
                💬 {post.commentCount} comments
              </span>
            </div>
          </LazyMotionDiv>
        ))}
      </LazyAnimatePresence>

      {/* Load More */}
      {hasNextPage && (
        <LazyMotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </LazyMotionDiv>
      )}
    </div>
  );
});
