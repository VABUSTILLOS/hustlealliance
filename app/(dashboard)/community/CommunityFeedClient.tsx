'use client';

import { useState, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store/useStore';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { LazyMotionDiv, LazyAnimatePresence } from '@/lib/framer/lazy-motion';
import { useCommunityFeed } from './useCommunityFeed';
import { PostCard } from './components/PostCard';
import type { GetCommunityPostsResult, TrendingTopic } from '@/lib/db/community';

const SortControls = dynamic(() => import('./SortControls').then((m) => ({ default: m.SortControls })));
const CommentTreeSection = lazy(() => import('./CommentTree'));

type SortMode = 'latest' | 'popular' | 'my-spaces';

interface CommunityFeedClientProps {
  initialData: GetCommunityPostsResult;
  trending: TrendingTopic[];
}

export function CommunityFeedClient({ initialData, trending }: CommunityFeedClientProps) {
  const toggleLike = useStore((s) => s.toggleLike);
  const user = useCurrentUser();
  const joinedSpaces = useStore((s) => s.joinedSpaces);

  const [sort, setSort] = useState<SortMode>('latest');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // React Query with server-provided initial data
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunityFeed({
    sort: sort === 'my-spaces' ? 'latest' : sort,
    initialData: {
      pages: [initialData],
      pageParams: [undefined],
    },
  });

  const posts = data?.pages.flatMap((page) => page.items) ?? initialData.items;

  // Client-side sort/filter
  const sorted = [...posts].sort((a, b) => {
    if (sort === 'popular') return b.commentCount - a.commentCount;
    return 0; // latest = preserve server order; my-spaces filtered below
  });

  const filtered = sort === 'my-spaces'
    ? sorted.filter((p) => !p.space || joinedSpaces.includes(p.space))
    : sorted;

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    toggleLike(postId);
  };

  return (
    <>
      <Suspense fallback={
        <div className="flex items-center gap-2 mb-6 h-9 animate-pulse">
          <div className="w-20 h-7 bg-surface/20 rounded-full" />
          <div className="w-20 h-7 bg-surface/20 rounded-full" />
          <div className="w-20 h-7 bg-surface/20 rounded-full" />
        </div>
      }>
        <SortControls sort={sort} onSortChange={setSort} />
      </Suspense>

      {/* Trending topics — server-fetched, no extra client round-trip */}
      {trending.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] shrink-0">
            🔥 Trending
          </span>
          {trending.map((t) => (
            <button
              key={t.space}
              onClick={() => setSort('latest')}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-mono bg-[var(--color-surface-light)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-accent)]/20 transition-colors border border-[var(--color-border-subtle)]"
            >
              {t.space}
              <span className="ml-1.5 text-[var(--color-muted)]">{t.postCount}</span>
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <LazyMotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-4"
        >
          <div className="text-6xl mb-4">💬</div>
          <h2 className="font-display text-2xl text-[var(--color-foreground)] uppercase mb-3">
            {sort === 'my-spaces' ? 'No posts in your spaces yet' : 'No posts yet'}
          </h2>
          <p className="text-[var(--color-foreground-muted)] text-sm mb-6 max-w-md mx-auto">
            {sort === 'my-spaces'
              ? 'Join a space to see posts from other founders.'
              : 'Be the first to share something with the community!'}
          </p>
        </LazyMotionDiv>
      ) : (
        <div className="space-y-4">
          <LazyAnimatePresence>
            {filtered.map((post) => {
              const commentsOpen = expandedComments.has(post.id);
              const isLiked = likedPosts.has(post.id);
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                  currentUserRole={user?.role}
                  isLiked={isLiked}
                  commentsOpen={commentsOpen}
                  onToggleLike={() => handleToggleLike(post.id)}
                  onToggleComments={() => toggleComments(post.id)}
                  commentChildren={
                    commentsOpen ? (
                      <Suspense fallback={
                        <div className="mt-4 pt-4 border-t border-surface-light animate-pulse">
                          <div className="h-16 bg-surface-light/50 rounded-xl" />
                        </div>
                      }>
                        <CommentTreeSection
                          postId={post.id}
                        />
                      </Suspense>
                    ) : undefined
                  }
                />
              );
            })}
          </LazyAnimatePresence>
        </div>
      )}

      {/* Load More */}
      {hasNextPage && (
        <LazyMotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </LazyMotionDiv>
      )}
    </>
  );
}
