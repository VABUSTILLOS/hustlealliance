'use client';

import { memo, useState, useCallback } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { LazyMotionDiv } from '@/lib/framer/lazy-motion';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAddComment } from './hooks/useAddComment';

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
  _count?: { likes: number };
}

interface CommentTreeProps {
  postId: string;
}

const CommentTreeInner = memo(function CommentTreeInner({
  postId,
}: CommentTreeProps) {
  const user = useCurrentUser();
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState('');
  const addComment = useAddComment(postId);

  const { data: comments = [], isLoading } = useQuery<CommentData[]>({
    queryKey: ['community-comments', postId],
    queryFn: async () => {
      const res = await fetch(`/api/community/posts/${postId}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      return res.json();
    },
    staleTime: 10_000,
  });

  const handleSubmit = useCallback(() => {
    const text = commentText.trim();
    if (!text || addComment.isPending) return;
    addComment.mutate(text, {
      onSuccess: () => setCommentText(''),
    });
  }, [commentText, addComment]);

  return (
    <LazyMotionDiv
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-4 pt-4 border-t border-surface-light space-y-3">
        {isLoading ? (
          <div className="h-10 bg-surface-light/50 rounded-xl animate-pulse ml-4" />
        ) : comments.length === 0 ? (
          <p className="text-muted text-xs ml-4">{t.community?.noComments ?? 'No comments yet'}</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-2 ml-4">
              <Image
                src={c.author.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User'}
                alt=""
                width={24}
                height={24}
                className="rounded-full border border-white/10 object-cover shrink-0 mt-0.5"
              />
              <div className="bg-surface-light rounded-xl px-3 py-2 flex-1">
                <p className="font-heading font-bold text-foreground text-xs">
                  {c.author.name}
                </p>
                <p className="text-foreground-muted text-xs">{c.content}</p>
              </div>
            </div>
          ))
        )}
        {/* Add comment input */}
        <div className="flex gap-2 ml-4 pt-1">
          <Image
            src={user?.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User'}
            alt=""
            width={24}
            height={24}
            className="rounded-full border border-white/10 object-cover shrink-0"
          />
          <div className="flex-1 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={t.community.writeComment}
              disabled={addComment.isPending}
              className="flex-1 bg-surface-light rounded-xl px-3 py-1.5 text-foreground text-xs outline-none placeholder:text-muted disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={!commentText.trim() || addComment.isPending}
              className="text-accent font-mono text-xs font-bold hover:text-accent-glow disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {addComment.isPending ? '...' : t.community.submit}
            </button>
          </div>
        </div>
      </div>
    </LazyMotionDiv>
  );
});

export default CommentTreeInner;
