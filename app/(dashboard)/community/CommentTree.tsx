'use client';

import { memo, useState, useCallback } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { LazyMotionDiv } from '@/lib/framer/lazy-motion';
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAddComment } from './hooks/useAddComment';
import { ReactionButton } from './components/ReactionButton';
import { RichPostContent } from './components/RichPostContent';

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
  _count?: { likes: number };
  myReaction?: string | null;
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
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

  const handleReply = useCallback(
    (parentId: string) => {
      const text = replyText.trim();
      if (!text || addComment.isPending) return;
      addComment.mutate(
        { content: text, parentId },
        {
          onSuccess: () => {
            setReplyText('');
            setReplyingTo(null);
          },
        },
      );
    },
    [replyText, addComment],
  );

  // Group replies under their parent (one level of threading)
  const topLevel = comments.filter((c) => !c.parentId);
  const repliesByParent = new Map<string, CommentData[]>();
  for (const c of comments) {
    if (!c.parentId) continue;
    const list = repliesByParent.get(c.parentId) ?? [];
    list.push(c);
    repliesByParent.set(c.parentId, list);
  }

  const renderComment = (c: CommentData, isReply: boolean) => (
    <div key={c.id} className={`flex gap-2 ${isReply ? 'ml-6 mt-2' : 'ml-4'}`}>
      <Image
        src={c.author.avatar ?? DEFAULT_AVATAR}
        alt=""
        width={24}
        height={24}
        className="rounded-full border border-white/10 object-cover shrink-0 mt-0.5"
      />
      <div className="bg-surface-light rounded-xl px-3 py-2 flex-1">
        <p className="font-heading font-bold text-foreground text-xs">
          {c.author.name}
        </p>
        <RichPostContent content={c.content} className="text-foreground-muted text-xs" />
        <div className="mt-1 flex items-center gap-3">
          <ReactionButton
            endpoint={`/api/community/comments/${c.id}/like`}
            initialCount={c._count?.likes ?? 0}
            initialMyReaction={c.myReaction ?? null}
            size="sm"
          />
          {!isReply && user && (
            <button
              onClick={() => {
                setReplyingTo(replyingTo === c.id ? null : c.id);
                setReplyText('');
              }}
              className="font-mono text-[10px] text-muted hover:text-accent transition-colors"
            >
              {t.community?.reply ?? 'Reply'}
            </button>
          )}
        </div>
        {!isReply && replyingTo === c.id && (
          <div className="flex gap-2 mt-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReply(c.id)}
              placeholder={t.community?.writeReply ?? 'Write a reply...'}
              disabled={addComment.isPending}
              autoFocus
              className="flex-1 bg-surface rounded-xl px-3 py-1.5 text-foreground text-xs outline-none placeholder:text-muted disabled:opacity-50 border border-surface-light"
            />
            <button
              onClick={() => handleReply(c.id)}
              disabled={!replyText.trim() || addComment.isPending}
              className="text-accent font-mono text-xs font-bold hover:text-accent-glow disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {addComment.isPending ? '...' : t.community.submit}
            </button>
          </div>
        )}
      </div>
    </div>
  );

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
          topLevel.map((c) => (
            <div key={c.id}>
              {renderComment(c, false)}
              {(repliesByParent.get(c.id) ?? []).map((r) => renderComment(r, true))}
            </div>
          ))
        )}
        {/* Add comment input */}
        <div className="flex gap-2 ml-4 pt-1">
          <Image
            src={user?.avatar ?? DEFAULT_AVATAR}
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
