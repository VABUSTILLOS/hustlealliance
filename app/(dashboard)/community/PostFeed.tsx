'use client';

import { memo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useStore } from '@/lib/store/useStore';
import type { FeedPost } from '@/lib/data/community';

const CommentTreeSection = lazy(() => import('./CommentTree'));

type SortMode = 'latest' | 'popular' | 'my-spaces';

interface PostFeedProps {
  sort: SortMode;
  visibleCount: number;
  expandedComments: Set<string>;
  commentTexts: Record<string, string>;
  onToggleLike: (postId: string) => void;
  onToggleComments: (postId: string) => void;
  onCommentTextChange: (postId: string, text: string) => void;
  onAddComment: (postId: string) => void;
  onLoadMore: () => void;
}

export const PostFeed = memo(function PostFeed({
  sort,
  visibleCount,
  expandedComments,
  commentTexts,
  onToggleLike,
  onToggleComments,
  onCommentTextChange,
  onAddComment,
  onLoadMore,
}: PostFeedProps) {
  const posts = useStore((s) => s.posts);
  const joinedSpaces = useStore((s) => s.joinedSpaces);

  const sorted = [...posts].sort((a, b) => {
    if (sort === 'popular') return b.likes - a.likes;
    return 0;
  });

  const filtered = sort === 'my-spaces'
    ? sorted.filter((p) => !p.space || joinedSpaces.includes(p.space))
    : sorted;

  const visible = filtered.slice(0, visibleCount);
  const hasPosts = visible.length > 0;

  return (
    <>
      {!hasPosts ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-4"
        >
          <div className="text-6xl mb-4">💬</div>
          <h2 className="font-display text-2xl text-[var(--color-foreground)] uppercase mb-3">
            {sort === 'my-spaces'
              ? 'No posts in your spaces yet'
              : 'No posts yet'}
          </h2>
          <p className="text-[var(--color-foreground-muted)] text-sm mb-6 max-w-md mx-auto">
            {sort === 'my-spaces'
              ? 'Join a space to see posts from other founders. Connecting with a community accelerates your growth.'
              : 'Be the first to share something with the community! Your journey can inspire someone else.'}
          </p>
          {sort === 'my-spaces' ? (
            <Link
              href="/spaces"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm hover:shadow-[0_0_30px_rgba(255,59,48,0.3)] transition-all"
            >
              Discover Spaces
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={() => document.querySelector('textarea')?.focus()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm hover:shadow-[0_0_30px_rgba(255,59,48,0.3)] transition-all"
            >
              Write a post
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {visible.map((post) => {
            const commentsOpen = expandedComments.has(post.id);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="bg-surface border border-surface-light rounded-2xl p-5"
              >
                {/* Author row */}
                <div className="flex items-center gap-3 mb-3">
                  <Image src={post.author.avatar} alt="" width={40} height={40} className="rounded-full border border-white/10 object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-foreground text-sm">{post.author.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-[10px] text-muted">@{post.author.username}</p>
                      <span className="text-muted text-[10px]">•</span>
                      <p className="text-muted text-[10px]">{post.timestamp}</p>
                    </div>
                  </div>
                  {post.space && (
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono uppercase">
                      {post.space}
                    </span>
                  )}
                </div>

                {/* Text */}
                <p className="text-foreground-muted text-sm mb-3 leading-relaxed">{post.text}</p>

                {/* Image */}
                {post.image && (
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 672px, 700px"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6">
                  <button onClick={() => onToggleLike(post.id)} className="flex items-center gap-1.5 group">
                    <svg className={clsx('w-4 h-4 transition-colors', post.liked ? 'text-accent fill-accent' : 'text-muted group-hover:text-accent')}
                      viewBox="0 0 24 24" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    <span className={clsx('text-xs font-mono', post.liked ? 'text-accent' : 'text-muted')}>{post.likes}</span>
                  </button>
                  <button onClick={() => onToggleComments(post.id)} className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <span className="text-xs font-mono">{post.comments.length}</span>
                  </button>
                </div>

                {/* Comments section — lazy loaded when expanded */}
                {commentsOpen && (
                  <Suspense fallback={<div className="mt-4 pt-4 border-t border-surface-light animate-pulse"><div className="h-16 bg-surface-light/50 rounded-xl ml-4" /></div>}>
                    <CommentTreeSection
                      postId={post.id}
                      commentText={commentTexts[post.id] || ''}
                      onCommentTextChange={(text) => onCommentTextChange(post.id, text)}
                      onAddComment={() => onAddComment(post.id)}
                    />
                  </Suspense>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      )}

      {/* Load More */}
      {hasPosts && visibleCount < filtered.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all"
          >
            Load More
          </button>
        </motion.div>
      )}
    </>
  );
});
