'use client';

import { useState, Suspense, lazy, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LazyMotionDiv, LazyAnimatePresence } from '@/lib/framer/lazy-motion';
import { useCommunityFeed } from './useCommunityFeed';
import { useLikePost } from './hooks/useLikePost';
import { usePersonalFeed, useGlobalFeed } from './hooks/useFeeds';
import { FeedTabs } from './FeedTabs';
import type { FeedTab } from './FeedTabs';
import type { GetCommunityPostsResult, TrendingTopic } from '@/lib/db/community';
import type { FeedItem, GlobalFeedPost } from './hooks/useFeeds';

const CommentTreeSection = lazy(() => import('./CommentTree'));

interface CommunityFeedClientProps {
  initialData: GetCommunityPostsResult;
  trending: TrendingTopic[];
}

function PostCard({ post }: { post: GetCommunityPostsResult['items'][number] }) {
  const { likeMutation, unlikeMutation } = useLikePost(post.id);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleToggleLike = useCallback(() => {
    if (isLiked) {
      unlikeMutation.mutate();
      setIsLiked(false);
    } else {
      likeMutation.mutate();
      setIsLiked(true);
    }
  }, [isLiked, likeMutation, unlikeMutation]);

  return (
    <LazyMotionDiv
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
          <Link href={`/member/${post.author.username}`} className="font-heading font-bold text-foreground text-sm hover:text-accent transition-colors">
            {post.author.name}
          </Link>
          <p className="font-mono text-[10px] text-muted">@{post.author.username}</p>
        </div>
        {post.space && (
          <Link
            href={`/spaces/${post.space}`}
            className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono uppercase hover:bg-accent/20 transition-colors"
          >
            {post.space}
          </Link>
        )}
      </div>

      {/* Content */}
      <p className="text-foreground-muted text-sm mb-3 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button onClick={handleToggleLike} className="flex items-center gap-1.5 group">
          <svg
            className={`w-4 h-4 transition-colors ${isLiked ? 'text-accent fill-accent' : 'text-muted group-hover:text-accent'}`}
            viewBox="0 0 24 24"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <span className={`text-xs font-mono ${isLiked ? 'text-accent' : 'text-muted'}`}>
            {post.commentCount ?? 0}
          </span>
        </button>
        <button
          onClick={() => setCommentsOpen((v) => !v)}
          className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className="text-xs font-mono">{post.commentCount}</span>
        </button>
      </div>

      {/* Comments — lazy loaded */}
      {commentsOpen && (
        <Suspense
          fallback={
            <div className="mt-4 pt-4 border-t border-surface-light animate-pulse">
              <div className="h-16 bg-surface-light/50 rounded-xl" />
            </div>
          }
        >
          <CommentTreeSection postId={post.id} />
        </Suspense>
      )}
    </LazyMotionDiv>
  );
}

export function CommunityFeedClient({ initialData, trending }: CommunityFeedClientProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>('spaces');

  // React Query with server-provided initial data for spaces feed
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunityFeed({
    sort: 'latest',
    initialData: {
      pages: [initialData],
      pageParams: [undefined],
    },
  });

  const posts = data?.pages.flatMap((page) => page.items) ?? initialData.items;

  return (
    <>
      <FeedTabs active={activeTab} onChange={setActiveTab} />

      {/* Trending topics — server-fetched */}
      {trending.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] shrink-0">
            🔥 Trending
          </span>
          {trending.map((t) => (
            <Link
              key={t.space}
              href={`/spaces/${t.space}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-mono bg-[var(--color-surface-light)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-accent)]/20 transition-colors border border-[var(--color-border-subtle)]"
            >
              {t.space}
              <span className="ml-1.5 text-[var(--color-muted)]">{t.postCount}</span>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'personal' && <PersonalFeedTab />}
      {activeTab === 'global' && <GlobalFeedTab />}

      {activeTab === 'spaces' && (
        <>
          {posts.length === 0 ? (
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
          ) : (
            <div className="space-y-4">
              <LazyAnimatePresence>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </LazyAnimatePresence>
            </div>
          )}

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
      )}
    </>
  );
}

// ── Tab content placeholders — hydrated by React Query ──────────────────

function PersonalFeedTab() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePersonalFeed();

  if (isLoading) return <FeedSkeleton />;

  const items = data?.pages?.flat() ?? [];

  if (!items.length) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-6xl mb-4">🔔</div>
        <h2 className="font-display text-2xl text-[var(--color-foreground)] uppercase mb-3">
          Your feed is empty
        </h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mb-6 max-w-md mx-auto">
          Follow other members and join groups to see their activity here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((item) => (
          <FeedItemCard key={item.id} item={item} />
        ))}
      </div>
      {hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}

function GlobalFeedTab() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGlobalFeed();

  if (isLoading) return <FeedSkeleton />;

  const items = data?.pages?.flat() ?? [];

  if (!items.length) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-6xl mb-4">🌍</div>
        <h2 className="font-display text-2xl text-[var(--color-foreground)] uppercase mb-3">
          Nothing here yet
        </h2>
        <p className="text-[var(--color-foreground-muted)] text-sm">
          Check back soon for community activity.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((item) => (
          <FeedItemCard key={item.id} item={item} />
        ))}
      </div>
      {hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}

// ── Feed item card for personal/global feeds ────────────────────────────

function FeedItemCard({ item }: { item: FeedItem | GlobalFeedPost }) {
  const isFeedItem = 'actor' in item;
  const actor = isFeedItem ? item.actor : (item as GlobalFeedPost).author;
  const metadata = isFeedItem ? item.metadata : undefined;
  const type = isFeedItem ? item.type : undefined;

  const typeLabel =
    type === 'POST_CREATED' ? 'posted' :
    type === 'POST_LIKED' ? 'liked a post' :
    type === 'GROUP_JOINED' ? 'joined a group' :
    type === 'EVENT_CREATED' ? 'created an event' :
    !isFeedItem ? 'posted' : 'shared';

  return (
    <LazyMotionDiv
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-surface-light rounded-2xl p-4"
    >
      <div className="flex items-center gap-3">
        {actor && (
          <Image
            src={((actor as { avatar?: string | null }).avatar) ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User'}
            alt=""
            width={36}
            height={36}
            className="rounded-full border border-white/10 object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--color-foreground-muted)]">
            <Link href={`/member/${(actor as { username?: string })?.username ?? '#'}`} className="font-heading font-bold text-foreground hover:text-accent">
              {(actor as { name?: string })?.name ?? 'Someone'}
            </Link>{' '}
            <span className="text-muted">{typeLabel}</span>
          </p>
          {(metadata as Record<string, unknown> | undefined)?.preview != null && (
            <p className="text-xs text-muted mt-1 line-clamp-2">
              {String((metadata as Record<string, unknown>).preview)}
            </p>
          )}
          <p className="font-mono text-[10px] text-muted mt-1">
            {item.createdAt ? new Date(item.createdAt as string).toLocaleDateString() : ''}
          </p>
        </div>
      </div>
    </LazyMotionDiv>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface border border-surface-light rounded-2xl p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-surface-light/50 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-surface-light/50 rounded w-24" />
              <div className="h-2 bg-surface-light/50 rounded w-16" />
            </div>
          </div>
          <div className="h-4 bg-surface-light/50 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}
