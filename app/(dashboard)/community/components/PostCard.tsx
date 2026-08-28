'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { LazyMotionDiv } from '@/lib/framer/lazy-motion';
import { getInitialsAvatarUrl } from '@/lib/utils/avatar';
import { timeAgo } from '@/lib/utils/time';
import type { CommunityPostItem } from '@/lib/db/community';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/app/components/ToastProvider';
import { PostCardMenu } from './PostCardMenu';
import { PostCardEditForm } from './PostCardEditForm';
import { PostCardModals } from './PostCardModals';
import { ReactionButton } from './ReactionButton';
import { PollCard } from './PollCard';

type PostType = 'milestone' | 'question' | 'data' | 'default';

function detectPostType(content: string): PostType {
  const c = content.trim();
  if (/^(.{0,3}?(launched|raised|acquired|hit\s|reached|shipped|crossed|closed|sold|exit))/i.test(c)) return 'milestone';
  if (/\$[\d,.]+[KMB]|MRR|ARR|\d+%|revenue|churn|CAC|LTV/i.test(c)) return 'data';
  if (/^(How|What|Any|Has anyone|Can someone|Does anyone|Is there|Should I|Question|Help|Advice)/i.test(c) || c.endsWith('?')) return 'question';
  return 'default';
}

const POST_TYPE_STYLES: Record<PostType, string> = {
  milestone: 'border-l-2 border-l-accent bg-gradient-to-r from-accent/5 to-transparent',
  question: 'border-l-2 border-l-amber-500/50',
  data: 'border-l-2 border-l-cyan-500/50 bg-gradient-to-r from-cyan-500/3 to-transparent',
  default: '',
};

const POST_TYPE_BADGE: Record<PostType, { emoji: string; label: string } | null> = {
  milestone: { emoji: '🚀', label: 'Milestone' },
  question: null,
  data: null,
  default: null,
};

interface PostCardProps {
  post: CommunityPostItem;
  currentUserId?: string;
  currentUserRole?: string;
  isLiked?: boolean;
  commentsOpen?: boolean;
  onToggleLike?: () => void;
  onToggleComments?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  commentChildren?: React.ReactNode;
}

export function PostCard({
  post,
  currentUserId,
  currentUserRole,
  isLiked = false,
  commentsOpen = false,
  onToggleComments,
  onDelete,
  onPin,
  commentChildren,
}: PostCardProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const { addToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(post.content);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [shareComment, setShareComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUserId === post.author.id;
  const isAdmin = currentUserRole === 'ADMIN';
  const postType = useMemo(() => detectPostType(post.content), [post.content]);
  const typeStyle = POST_TYPE_STYLES[postType];
  const typeBadge = POST_TYPE_BADGE[postType];
  const shareTimesLabel = locale === 'es'
    ? (post.shareCount === 1 ? 'vez' : 'veces')
    : (post.shareCount === 1 ? 'time' : 'times');

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleToggleBookmark = useCallback(async () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    try {
      const res = await fetch('/api/community/bookmarks', {
        method: next ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });
      if (!res.ok) throw new Error();
      addToast({ message: next ? 'Post saved' : 'Removed from saved', type: 'success' });
    } catch {
      setIsBookmarked(!next);
      addToast({ message: 'Failed to update bookmark', type: 'error' });
    }
  }, [isBookmarked, post.id, addToast]);

  const handleSaveEdit = useCallback(async () => {
    if (!editText.trim() || editText === post.content) {
      setEditMode(false);
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editText }),
      });
      if (!res.ok) {
        const data = await res.json();
        addToast({ message: data.error || t.community.saveError, type: 'error' });
        return;
      }
      setEditMode(false);
      router.refresh();
    } catch {
      addToast({ message: t.community.saveError, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [editText, post.id, post.content, t.community.saveError, addToast, router]);

  const handleDelete = useCallback(async () => {
    if (!confirm(t.community.deleteConfirm)) return;
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        addToast({ message: data.error || t.community.deleteError, type: 'error' });
        return;
      }
      onDelete?.();
      addToast({ message: t.community.postDeleted || 'Post deleted', type: 'success' });
    } catch {
      addToast({ message: t.community.deleteError, type: 'error' });
    }
  }, [onDelete, post.id, t.community.deleteConfirm, t.community.deleteError, addToast]);

  const handlePin = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/posts/${post.id}/pin`, { method: 'PUT' });
      if (!res.ok) {
        const data = await res.json();
        addToast({ message: data.error || t.community.pinError, type: 'error' });
        return;
      }
      onPin?.();
      router.refresh();
    } catch {
      addToast({ message: t.community.pinError, type: 'error' });
    }
  }, [onPin, post.id, t.community.pinError, addToast, router]);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/community/posts/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [post.id]);

  const handleShare = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/posts/${post.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: shareComment || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        addToast({ message: data.error || t.community.shareError, type: 'error' });
        return;
      }
      setShareModalOpen(false);
      setShareComment('');
      router.refresh();
      addToast({ message: t.community.postShared || 'Post shared', type: 'success' });
    } catch {
      addToast({ message: t.community.shareError, type: 'error' });
    }
  }, [post.id, shareComment, t.community.shareError, addToast, router]);

  const handleReport = useCallback(async () => {
    if (!reportReason.trim()) return;
    try {
      const res = await fetch(`/api/community/posts/${post.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason }),
      });
      if (!res.ok) {
        const data = await res.json();
        addToast({ message: data.error || t.community.reportError, type: 'error' });
        return;
      }
      setReportModalOpen(false);
      setReportReason('');
      addToast({ message: t.community.reportSubmitted || 'Report submitted', type: 'info' });
    } catch {
      addToast({ message: t.community.reportError, type: 'error' });
    }
  }, [post.id, reportReason, t.community.reportError, addToast]);

  return (
    <LazyMotionDiv
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={clsx(
        'bg-surface border border-surface-light rounded-2xl p-5 relative',
        typeStyle,
      )}
      role="article"
      aria-label={`Post by ${post.author.name}`}
    >
      {post.isPinned && (
        <div className="absolute top-3 right-3" aria-label="Pinned post">
          <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
        </div>
      )}

      {typeBadge && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono uppercase">
            {typeBadge.emoji} {typeBadge.label}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <Image
          src={post.author.avatar ?? getInitialsAvatarUrl(post.author.name)}
          alt=""
          width={40}
          height={40}
          className="rounded-full border border-white/10 object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-foreground text-sm">{post.author.name}</p>
          <div className="flex items-center gap-2">
            {post.author.username && (
              <p className="font-mono text-[10px] text-muted">@{post.author.username}</p>
            )}
            <span className="text-muted text-[10px]">·</span>
            <p className="font-mono text-[10px] text-muted">{timeAgo(post.createdAt)}</p>
            {post.isEdited && (
              <span className="font-mono text-[10px] text-muted">{t.community.edited}</span>
            )}
          </div>
        </div>
        {post.space && (
          <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono uppercase">
            {post.space}
          </span>
        )}
      </div>

      {editMode ? (
        <PostCardEditForm
          editText={editText}
          isSaving={isSaving}
          onChange={setEditText}
          onSave={handleSaveEdit}
          onCancel={() => { setEditMode(false); setEditText(post.content); }}
        />
      ) : (
        <p className={clsx(
          'text-foreground-muted text-sm mb-3 leading-relaxed whitespace-pre-wrap',
          postType === 'data' && 'font-mono',
        )}>
          {post.content}
        </p>
      )}

      {post.imageUrls.length > 0 && (
        <div className={clsx('mb-3 grid gap-2', post.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
          {post.imageUrls.map((url, i) => (
            <Image
              key={i}
              src={url}
              alt={t.community.postImage.replace('{n}', String(i + 1))}
              width={500}
              height={400}
              className="rounded-xl max-h-64 object-cover w-full"
            />
          ))}
        </div>
      )}

      {post.poll && <PollCard poll={post.poll} />}

      <div className="flex items-center gap-4">
        <ReactionButton
          endpoint={`/api/community/posts/${post.id}/like`}
          initialCount={post.likeCount}
          initialMyReaction={post.myReaction ?? (isLiked ? 'LIKE' : null)}
          initialCounts={post.reactionCounts ?? {}}
        />

        <button
          onClick={onToggleComments}
          className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 rounded-lg px-1 -mx-1"
          aria-label={commentsOpen ? 'Hide comments' : 'Show comments'}
          aria-expanded={commentsOpen}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className="text-xs font-mono">{post.commentCount}</span>
        </button>

        <div className="flex items-center gap-1.5 text-muted" aria-label={`${post.shareCount} shares`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span className="text-xs font-mono">{post.shareCount}</span>
        </div>

        <div ref={menuRef} className="relative ml-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-light transition-colors focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label="Post actions menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
          {menuOpen && (
            <PostCardMenu
              isOwner={isOwner}
              isAdmin={isAdmin}
              isPinned={post.isPinned}
              copied={copied}
              isBookmarked={isBookmarked}
              onToggleBookmark={() => { handleToggleBookmark(); setMenuOpen(false); }}
              onEdit={() => { setEditMode(true); setMenuOpen(false); }}
              onDelete={() => { handleDelete(); setMenuOpen(false); }}
              onPin={() => { handlePin(); setMenuOpen(false); }}
              onCopyLink={() => { handleCopyLink(); setMenuOpen(false); }}
              onShare={() => { setShareModalOpen(true); setMenuOpen(false); }}
              onReport={() => { setReportModalOpen(true); setMenuOpen(false); }}
            />
          )}
        </div>
      </div>

      {post.shareCount > 0 && (
        <p className="text-[10px] text-muted font-mono mt-2 ml-1">
          🔄 {t.community.sharedCount.replace('{count}', String(post.shareCount)).replace('{times}', shareTimesLabel)}
        </p>
      )}

      {commentsOpen && commentChildren}

      <PostCardModals
        shareModalOpen={shareModalOpen}
        reportModalOpen={reportModalOpen}
        shareComment={shareComment}
        reportReason={reportReason}
        onShareCommentChange={setShareComment}
        onReportReasonChange={setReportReason}
        onShareSubmit={handleShare}
        onReportSubmit={handleReport}
        onCloseShare={() => setShareModalOpen(false)}
        onCloseReport={() => { setReportModalOpen(false); setReportReason(''); }}
      />
    </LazyMotionDiv>
  );
}
