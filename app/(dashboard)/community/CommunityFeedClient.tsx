'use client';

import { useState, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useStore } from '@/lib/store/useStore';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { LazyMotionDiv, LazyAnimatePresence } from '@/lib/framer/lazy-motion';
import { useCommunityFeed } from './useCommunityFeed';
import type { GetCommunityPostsResult } from '@/lib/db/community';
import type { Comment } from '@/lib/data/community';

const SortControls = dynamic(() => import('./SortControls').then((m) => ({ default: m.SortControls })));
const CommentTreeSection = lazy(() => import('./CommentTree'));

type SortMode = 'latest' | 'popular' | 'my-spaces';

interface CommunityFeedClientProps {
  initialData: GetCommunityPostsResult;
}

export function CommunityFeedClient({ initialData }: CommunityFeedClientProps) {
  const toggleLike = useStore((s) => s.toggleLike);
  const addComment = useStore((s) => s.addComment);
  const user = useCurrentUser();
  const joinedSpaces = useStore((s) => s.joinedSpaces);

  const [sort, setSort] = useState<SortMode>('latest');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
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

  const handleCommentTextChange = (postId: string, text: string) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentTexts[postId]?.trim();
    if (!text) return;
    const comment: Comment = {
      id: String(Date.now()),
      author: { username: user?.username ?? 'member', name: user?.name ?? 'Member', avatar: user?.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User' },
      text,
      timestamp: 'Just now',
    };
    addComment(postId, comment);
    setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
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

                  {/* Actions */}
                  <div className="flex items-center gap-6">
                    <button onClick={() => handleToggleLike(post.id)} className="flex items-center gap-1.5 group">
                      <svg className={`w-4 h-4 transition-colors ${isLiked ? 'text-accent fill-accent' : 'text-muted group-hover:text-accent'}`}
                        viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                      <span className={`text-xs font-mono ${isLiked ? 'text-accent' : 'text-muted'}`}>
                        {isLiked ? 1 : 0}
                      </span>
                    </button>
                    <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      <span className="text-xs font-mono">{post.commentCount}</span>
                    </button>
                  </div>

                  {/* Comments — lazy loaded */}
                  {commentsOpen && (
                    <Suspense fallback={<div className="mt-4 pt-4 border-t border-surface-light animate-pulse"><div className="h-16 bg-surface-light/50 rounded-xl" /></div>}>
                      <CommentTreeSection
                        postId={post.id}
                        commentText={commentTexts[post.id] || ''}
                        onCommentTextChange={(text) => handleCommentTextChange(post.id, text)}
                        onAddComment={() => handleAddComment(post.id)}
                      />
                    </Suspense>
                  )}
                </LazyMotionDiv>
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
