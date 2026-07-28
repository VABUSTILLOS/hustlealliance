'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store/useStore';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface CommentTreeProps {
  postId: string;
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: () => void;
}

const CommentTreeInner = memo(function CommentTreeInner({
  postId,
  commentText,
  onCommentTextChange,
  onAddComment,
}: CommentTreeProps) {
  const posts = useStore((s) => s.posts);
  const user = useCurrentUser();
  const { t } = useTranslation();

  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-4 pt-4 border-t border-surface-light space-y-3">
        {post.comments.map((c) => (
          <div key={c.id} className="flex gap-2 ml-4">
            <img src={c.author.avatar} alt="" className="w-6 h-6 rounded-full border border-white/10 object-cover shrink-0 mt-0.5" />
            <div className="bg-surface-light rounded-xl px-3 py-2 flex-1">
              <p className="font-heading font-bold text-foreground text-xs">{c.author.name}</p>
              <p className="text-foreground-muted text-xs">{c.text}</p>
            </div>
          </div>
        ))}
        {/* Add comment */}
        <div className="flex gap-2 ml-4 pt-1">
          <img src={user?.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User'} alt="" className="w-6 h-6 rounded-full border border-white/10 object-cover shrink-0" />
          <div className="flex-1 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => onCommentTextChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
              placeholder={t.community.writeComment}
              className="flex-1 bg-surface-light rounded-xl px-3 py-1.5 text-foreground text-xs outline-none placeholder:text-muted"
            />
            <button
              onClick={onAddComment}
              className="text-accent font-mono text-xs font-bold hover:text-accent-glow"
            >
              {t.community.submit}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default CommentTreeInner;
