'use client';

import { useState, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store/useStore';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { LazyMotionDiv, LazyAnimatePresence } from '@/lib/framer/lazy-motion';
import { useCommunityFeed } from './useCommunityFeed';
import { usePersonalFeed, useGlobalFeed } from './hooks/useFeeds';
import { PostCard } from './components/PostCard';
import { FeedItemCard } from './components/FeedItemCard';
import type { GetCommunityPostsResult, TrendingTopic } from '@/lib/db/community';
import type { FeedTab } from './FeedTabs';

const SortControls = dynamic(() => import('./SortControls').then((m) => ({ default: m.SortControls })));
const CommentTreeSection = lazy(() => import('./CommentTree'));

type SortMode = 'latest' | 'popular' | 'my-spaces';

interface CommunityFeedClientProps {
  initialData: GetCommunityPostsResult;
  trending: TrendingTopic[];
  activeTab: FeedTab;
}

export function CommunityFeedClient({ initialData, trending, activeTab }: CommunityFeedClientProps) {
  const toggleLike = useStore((s) => s.toggleLike);
  const user = useCurrentUser();
  const joinedSpaces = useStore((s) => s.joinedSpaces);

  const [sort, setSort] = useState<SortMode>('latest');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // ── Personal Feed (FeedItem table) ──
  const personalFeed = usePersonalFeed();
  const personalItems = personalFeed.data?.pages.flat() ?? [];

  // ── Global Feed (CommunityPost table, public) ──
  const globalFeed = useGlobalFeed();

  // ── Spaces / Community Feed ──
  const communityFeed = useCommunityFeed({
    sort: sort === 'my-spaces' ? 'latest' : sort,
    initialData: activeTab === 'spaces' ? { pages: [initialData], pageParams: [undefined] } : undefined,
    enabled: activeTab === 'spaces',
  });

  const posts = communityFeed.data?.pages.flatMap((page) => page.items) ?? (activeTab === 'spaces' ? initialData.items : []);

  // Client-side sort/filter
  const sorted = [...posts].sort((a, b) => {
    if (sort === 'popular') return b.commentCount - a.commentCount;
    return 0;
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

  // ── Render: Personal Feed ──
  if (activeTab === 'personal') {
    return (
      <>
        {personalFeed.isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface/20 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : personalItems.length === 0 ? (
          <LazyMotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="font-display text-2xl text-[var(--color-foreground)] uppercase mb-3">Your feed is empty</h2>
            <p className="text-[var(--color-foreground-muted)] text-sm max-w-md mx-auto">
              Follow other founders to see their activity here.
            </p>
          </LazyMotionDiv>
        ) : (
          <div className="space-y-3">
            {personalItems.map((item) => (
              <FeedItemCard key={item.id} item={item} />
            ))}
            {personalFeed.hasNextPage && (
              <div className="text-center mt-6">
                <button
                  onClick={() => personalFeed.fetchNextPage()}
                  disabled={personalFeed.isFetchingNextPage}
                  className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50"
                >
                  {personalFeed.isFetchingNextPage ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  // ── Render: Global Feed ──
  if (activeTab === 'global') {
    const globalPages = globalFeed.data?.pages ?? [];
    const globalPosts = globalPages.flat().map((p) => ({
      id: p.id,
      content: p.content,
      space: null as string | null,
      createdAt: p.createdAt,
      commentCount: p._count.comments,
      likeCount: p._count.likes,
      shareCount: 0,
      isPinned: false,
      isEdited: false,
      imageUrls: [] as string[],
      author: {
        id: p.author.id,
        name: p.author.name,
        username: p.author.username,
        avatar: p.author.avatar,
      },
    }));

    return (
      <>
        {globalFeed.isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-surface/20 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : globalPosts.length === 0 ? (
          <LazyMotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="font-display text-2xl text-[var(--color-foreground)] uppercase mb-3">No global posts yet</h2>
            <p className="text-[var(--color-foreground-muted)] text-sm max-w-md mx-auto">
              Be the first to share something with the world!
            </p>
          </LazyMotionDiv>
        ) : (
          <div className="space-y-4">
            <LazyAnimatePresence>
              {globalPosts.map((post) => {
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
                          <CommentTreeSection postId={post.id} />
                        </Suspense>
                      ) : undefined
                    }
                  />
                );
              })}
            </LazyAnimatePresence>
            {globalFeed.hasNextPage && (
              <div className="text-center mt-8">
                <button
                  onClick={() => globalFeed.fetchNextPage()}
                  disabled={globalFeed.isFetchingNextPage}
                  className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50"
                >
                  {globalFeed.isFetchingNextPage ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  // ── Render: Spaces Feed (default) ──
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
        <LazyMotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 px-4">
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
                        <CommentTreeSection postId={post.id} />
                      </Suspense>
                    ) : undefined
                  }
                />
              );
            })}
          </LazyAnimatePresence>
        </div>
      )}

      {communityFeed.hasNextPage && (
        <LazyMotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-8">
          <button
            onClick={() => communityFeed.fetchNextPage()}
            disabled={communityFeed.isFetchingNextPage}
            className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50"
          >
            {communityFeed.isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </LazyMotionDiv>
      )}
    </>
  );
}
