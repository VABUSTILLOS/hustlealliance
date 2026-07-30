'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { LazyMotionDiv } from '@/lib/framer/lazy-motion';
import { getInitialsAvatarUrl } from '@/lib/utils/avatar';
import { timeAgo } from '@/lib/utils/time';
import type { CommunityPostItem } from '@/lib/db/community';
import { useTranslation } from '@/lib/i18n/useTranslation';

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
  onToggleLike,
  onToggleComments,
  onDelete,
  onPin,
  commentChildren,
}: PostCardProps) {
  const { t, locale } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(post.content);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [shareComment, setShareComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUserId === post.author.id;
  const isAdmin = currentUserRole === 'ADMIN';
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
        alert(data.error || t.community.saveError);
        return;
      }
      setEditMode(false);
      window.location.reload();
    } catch {
      alert(t.community.saveError);
    } finally {
      setIsSaving(false);
    }
  }, [editText, post.id, post.content, t.community.saveError]);

  const handleDelete = useCallback(async () => {
    if (!confirm(t.community.deleteConfirm)) return;
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || t.community.deleteError);
        return;
      }
      onDelete?.();
    } catch {
      alert(t.community.deleteError);
    }
  }, [onDelete, post.id, t.community.deleteConfirm, t.community.deleteError]);

  const handlePin = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/posts/${post.id}/pin`, { method: 'PUT' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || t.community.pinError);
        return;
      }
      onPin?.();
    } catch {
      alert(t.community.pinError);
    }
  }, [onPin, post.id, t.community.pinError]);

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
        alert(data.error || t.community.shareError);
        return;
      }
      setShareModalOpen(false);
      setShareComment('');
      window.location.reload();
    } catch {
      alert(t.community.shareError);
    }
  }, [post.id, shareComment, t.community.shareError]);

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
        alert(data.error || t.community.reportError);
        return;
      }
      setReportModalOpen(false);
      setReportReason('');
    } catch {
      alert(t.community.reportError);
    }
  }, [post.id, reportReason, t.community.reportError]);

  return (
    <LazyMotionDiv
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="bg-surface border border-surface-light rounded-2xl p-5 relative"
    >
      {post.isPinned && (
        <div className="absolute top-3 right-3">
          <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
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
            <p className="font-mono text-[10px] text-muted">@{post.author.username}</p>
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
        <div className="mb-3 space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="w-full bg-surface-light rounded-xl px-3 py-2 text-foreground text-sm outline-none border border-white/10 focus:border-accent/50 resize-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-heading font-bold disabled:opacity-50"
            >
              {isSaving ? t.community.saving : t.community.save}
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setEditText(post.content);
              }}
              className="px-3 py-1.5 rounded-lg bg-surface-light text-muted text-xs"
            >
              {t.community.cancel}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-foreground-muted text-sm mb-3 leading-relaxed whitespace-pre-wrap">
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

      <div className="flex items-center gap-4">
        <button onClick={onToggleLike} className="flex items-center gap-1.5 group">
          <svg
            className={clsx('w-4 h-4 transition-colors', isLiked ? 'text-accent fill-accent' : 'text-muted group-hover:text-accent')}
            viewBox="0 0 24 24"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <span className={clsx('text-xs font-mono', isLiked ? 'text-accent' : 'text-muted')}>
            {post.likeCount > 0 ? post.likeCount : (isLiked ? 1 : 0)}
          </span>
        </button>

        <button onClick={onToggleComments} className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className="text-xs font-mono">{post.commentCount}</span>
        </button>

        <div className="flex items-center gap-1.5 text-muted">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-light transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-surface-light rounded-xl shadow-xl z-50 py-1">
              {isOwner && (
                <>
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors flex items-center gap-2"
                  >
                    {t.community.edit}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-light transition-colors flex items-center gap-2"
                  >
                    {t.community.delete}
                  </button>
                </>
              )}
              {(isOwner || isAdmin) && (
                <button
                  onClick={() => {
                    handlePin();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors flex items-center gap-2"
                >
                  {post.isPinned ? t.community.unpin : t.community.pin}
                </button>
              )}
              <button
                onClick={() => {
                  handleCopyLink();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors flex items-center gap-2"
              >
                {copied ? t.community.copied : t.community.copyLink}
              </button>
              <button
                onClick={() => {
                  setShareModalOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors flex items-center gap-2"
              >
                {t.community.sharing}
              </button>
              {!isOwner && (
                <button
                  onClick={() => {
                    setReportModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-light transition-colors flex items-center gap-2"
                >
                  {t.community.report}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {post.shareCount > 0 && (
        <p className="text-[10px] text-muted font-mono mt-2 ml-1">
          🔄 {t.community.sharedCount.replace('{count}', String(post.shareCount)).replace('{times}', shareTimesLabel)}
        </p>
      )}

      {commentsOpen && commentChildren}

      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShareModalOpen(false)}>
          <div className="bg-surface border border-surface-light rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-foreground text-lg mb-4">{t.community.sharePostTitle}</h3>
            <textarea
              value={shareComment}
              onChange={(e) => setShareComment(e.target.value)}
              placeholder={t.community.shareCommentPlaceholder}
              rows={3}
              className="w-full bg-surface-light rounded-xl px-3 py-2 text-foreground text-sm outline-none border border-white/10 focus:border-accent/50 resize-none mb-4"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShareModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-light text-muted text-sm"
              >
                {t.community.cancel}
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-heading font-bold"
              >
                {t.community.sharing}
              </button>
            </div>
          </div>
        </div>
      )}

      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setReportModalOpen(false)}>
          <div className="bg-surface border border-surface-light rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-foreground text-lg mb-4">{t.community.reportPostTitle}</h3>
            <p className="text-foreground-muted text-sm mb-3">{t.community.reportPostQuestion}</p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder={t.community.reportIssuePlaceholder}
              rows={3}
              className="w-full bg-surface-light rounded-xl px-3 py-2 text-foreground text-sm outline-none border border-white/10 focus:border-accent/50 resize-none mb-4"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setReportModalOpen(false);
                  setReportReason('');
                }}
                className="px-4 py-2 rounded-lg bg-surface-light text-muted text-sm"
              >
                {t.community.cancel}
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-heading font-bold disabled:opacity-50"
              >
                {t.community.report}
              </button>
            </div>
          </div>
        </div>
      )}
    </LazyMotionDiv>
  );
}
