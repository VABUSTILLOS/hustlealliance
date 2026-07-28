'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store/useStore';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useRealtimePosts } from '@/lib/hooks/useRealtimePosts';
import { CommunityHeader } from './CommunityHeader';
import { PostCreator } from './PostCreator';
import type { Comment } from '@/lib/data/community';

type SortMode = 'latest' | 'popular' | 'my-spaces';

const PostFeed = dynamic(() => import('./PostFeed').then((m) => ({ default: m.PostFeed })), {
  loading: () => <PostFeedSkeleton />,
});
const SortControls = dynamic(() => import('./SortControls').then((m) => ({ default: m.SortControls })));

import { PostFeedSkeleton } from './PostFeedSkeleton';

export default function CommunityPage() {
  const toggleLike = useStore((s) => s.toggleLike);
  const addComment = useStore((s) => s.addComment);
  const user = useCurrentUser();
  useRealtimePosts();

  const [sort, setSort] = useState<SortMode>('latest');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [visibleCount, setVisibleCount] = useState(5);

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <CommunityHeader />
      <PostCreator />
      <Suspense fallback={<div className="flex items-center gap-2 mb-6 h-9 animate-pulse"><div className="w-20 h-7 bg-surface/20 rounded-full" /><div className="w-20 h-7 bg-surface/20 rounded-full" /><div className="w-20 h-7 bg-surface/20 rounded-full" /></div>}>
        <SortControls sort={sort} onSortChange={setSort} />
      </Suspense>
      <Suspense fallback={<PostFeedSkeleton />}>
        <PostFeed
          sort={sort}
          visibleCount={visibleCount}
          expandedComments={expandedComments}
          commentTexts={commentTexts}
          onToggleLike={toggleLike}
          onToggleComments={toggleComments}
          onCommentTextChange={handleCommentTextChange}
          onAddComment={handleAddComment}
          onLoadMore={() => setVisibleCount((c) => c + 5)}
        />
      </Suspense>
    </div>
  );
}
