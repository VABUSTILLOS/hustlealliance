'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useStore } from '@/lib/store/useStore';
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import { LazyMotionDiv, LazyAnimatePresence } from '@/lib/framer/lazy-motion';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { spaces as allSpaces } from '@/lib/data/spaces';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useCreatePost } from './hooks/useCreatePost';
import { useToast } from '@/app/components/ToastProvider';

const MAX_CHARS = 500;
const MENTION_MIN_LENGTH = 2;

export function PostCreator() {
  const joinedSpaces = useStore((s) => s.joinedSpaces);
  const user = useCurrentUser();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const createPost = useCreatePost();

  const [newPostText, setNewPostText] = useState('');
  const [newPostSpace, setNewPostSpace] = useState('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'CONNECTIONS_ONLY'>('PUBLIC');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [pollMode, setPollMode] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // @mention state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState<number>(-1);
  const [mentionResults, setMentionResults] = useState<Array<{ id: string; name: string; username: string; avatar: string }>>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const charCount = newPostText.length;
  const isOverLimit = charCount > MAX_CHARS;

  // Handle @mention detection
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewPostText(value);

    // Find @mention in progress after the last @ symbol
    const cursorPos = e.target.selectionStart ?? value.length;
    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const query = textBeforeCursor.slice(lastAtIndex + 1);
      // Only trigger if @ is at start, after space, or after newline
      const charBeforeAt = lastAtIndex === 0 ? ' ' : textBeforeCursor[lastAtIndex - 1];
      const isValidMention = charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0;

      if (isValidMention && !query.includes(' ') && query.length >= MENTION_MIN_LENGTH) {
        setMentionQuery(query);
        setMentionIndex(lastAtIndex);
        return;
      }
    }
    setMentionQuery(null);
    setMentionIndex(-1);
    setMentionResults([]);
  }, []);

  // Debounced user search for mentions
  useEffect(() => {
    if (!mentionQuery) return;

    if (mentionTimerRef.current) clearTimeout(mentionTimerRef.current);
    mentionTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/community/users/search?q=${encodeURIComponent(mentionQuery)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setMentionResults(data.users ?? []);
        }
      } catch {
        // Silently fail - mentions are a nice-to-have
      }
    }, 300);

    return () => {
      if (mentionTimerRef.current) clearTimeout(mentionTimerRef.current);
    };
  }, [mentionQuery]);

  // Insert mention into text
  const handleSelectMention = useCallback((username: string) => {
    if (mentionIndex === -1) return;
    const before = newPostText.slice(0, mentionIndex);
    const after = newPostText.slice(mentionIndex + 1 + (mentionQuery?.length ?? 0));
    const newText = `${before}@${username} ${after}`;
    setNewPostText(newText);
    setMentionQuery(null);
    setMentionIndex(-1);
    setMentionResults([]);
    textareaRef.current?.focus();
  }, [mentionIndex, mentionQuery, newPostText]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/community/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        addToast({ message: data.error || 'Upload failed', type: 'error' });
        return;
      }

      const data = await res.json();
      setPreviewImage(data.url);
    } catch {
      // Fallback to local preview
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const validPollOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
  const pollValid = !pollMode || validPollOptions.length >= 2;

  const handlePost = async () => {
    const content = newPostText.trim();
    if (!content || isOverLimit || !pollValid || createPost.isPending) return;

    try {
      await createPost.mutateAsync({
        content,
        space: newPostSpace || undefined,
        imageUrls: previewImage ? [previewImage] : undefined,
        visibility,
        ...(pollMode
          ? { poll: { question: content, options: validPollOptions.slice(0, 4) } }
          : {}),
      });
      setNewPostText('');
      setPreviewImage(null);
      setNewPostSpace('');
      setVisibility('PUBLIC');
      setPollMode(false);
      setPollOptions(['', '']);
      addToast({ message: t.community.postSuccess, type: 'success' });
    } catch (err) {
      addToast({ message: err instanceof Error ? err.message : t.community.postFailed, type: 'error' });
    }
  };

  const handleAiAssist = async () => {
    const text = newPostText.trim();
    if (!text || isAiAssisting) return;
    setIsAiAssisting(true);
    try {
      const res = await fetch('/api/ai/post-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        addToast({ message: data.error || 'AI assist failed', type: 'error' });
        return;
      }
      const data = await res.json();
      const improved: string = data.output?.improved ?? '';
      if (improved) setNewPostText(improved);
      if (data.output?.hashtags?.length) {
        addToast({ message: `✨ Hashtags: ${data.output.hashtags.map((h: string) => '#' + h).join(' ')}`, type: 'success' });
      } else {
        addToast({ message: t.community.postSuccess, type: 'success' });
      }
    } catch {
      addToast({ message: 'AI assist failed', type: 'error' });
    } finally {
      setIsAiAssisting(false);
    }
  };

  return (
    <LazyMotionDiv
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface border border-surface-light rounded-2xl p-5 mb-6"
    >
      <div className="flex gap-3">
        <Image src={user?.avatar ?? DEFAULT_AVATAR} alt="" width={40} height={40} className="rounded-full border border-white/10 object-cover shrink-0" />
        <div className="flex-1 space-y-3 relative">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={newPostText}
              onChange={handleTextChange}
              placeholder={t.community.createPost}
              rows={3}
              className="w-full bg-transparent text-foreground placeholder:text-muted text-sm resize-none outline-none"
            />

            {/* @mention autocomplete dropdown */}
            <LazyAnimatePresence>
              {mentionQuery && mentionResults.length > 0 && (
                <LazyMotionDiv
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 top-full mt-1 w-56 bg-surface border border-surface-light rounded-xl shadow-xl z-20 py-1"
                >
                  {mentionResults.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSelectMention(u.username)}
                      className="w-full text-left px-3 py-2 hover:bg-surface-light transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                    >
                      <Image src={u.avatar ?? getInitialsAvatarUrl(u.name)} alt="" width={24} height={24} className="rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-heading font-bold text-foreground truncate">{u.name}</p>
                        <p className="text-[10px] text-muted">@{u.username}</p>
                      </div>
                    </button>
                  ))}
                </LazyMotionDiv>
              )}
            </LazyAnimatePresence>
          </div>

          {/* Character count */}
          <div className="flex items-center justify-between">
            <span className={clsx(
              'font-mono text-[10px]',
              isOverLimit ? 'text-red-400' : charCount > MAX_CHARS * 0.8 ? 'text-yellow-400' : 'text-muted'
            )}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>

          {/* Poll options editor */}
          {pollMode && (
            <div className="space-y-2 rounded-xl border border-surface-light bg-surface-light/40 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted">Poll options</p>
              {pollOptions.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={option}
                    onChange={(e) =>
                      setPollOptions((opts) => opts.map((o, j) => (j === i ? e.target.value : o)))
                    }
                    placeholder={`Option ${i + 1}`}
                    maxLength={80}
                    className="flex-1 bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-foreground text-xs outline-none placeholder:text-muted"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => setPollOptions((opts) => opts.filter((_, j) => j !== i))}
                      className="text-muted hover:text-red-400 text-xs"
                      aria-label={`Remove option ${i + 1}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button
                  onClick={() => setPollOptions((opts) => [...opts, ''])}
                  className="text-accent text-xs font-mono hover:text-accent-glow"
                >
                  + Add option
                </button>
              )}
            </div>
          )}

          {previewImage && (
            <div className="relative inline-block">
              <Image src={previewImage} alt={t.community.previewImage} width={400} height={300} className="max-h-48 rounded-lg" style={{ width: 'auto', height: 'auto' }} />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Image upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-light transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                title={t.community.imageHint}
              >
                {isUploading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageUpload}
              />

              {/* AI post assist */}
              <button
                onClick={handleAiAssist}
                disabled={!newPostText.trim() || isAiAssisting}
                className={clsx(
                  'p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none',
                  isAiAssisting
                    ? 'text-accent opacity-70 cursor-wait'
                    : newPostText.trim()
                      ? 'text-accent hover:bg-accent/10'
                      : 'text-muted cursor-not-allowed hover:text-foreground hover:bg-surface-light',
                )}
                title="✨ Polish this post with AI"
                aria-pressed={isAiAssisting}
              >
                {isAiAssisting ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
                    <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
                  </svg>
                )}
              </button>

              {/* Poll toggle */}
              <button
                onClick={() => {
                  setPollMode((v) => !v);
                  setPollOptions(['', '']);
                }}
                className={clsx(
                  'p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none',
                  pollMode ? 'text-accent bg-accent/10' : 'text-muted hover:text-foreground hover:bg-surface-light',
                )}
                title="Create a poll"
                aria-pressed={pollMode}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              </button>

              {/* Space selector */}
              <select
                value={newPostSpace}
                onChange={(e) => setNewPostSpace(e.target.value)}
                className="bg-surface-light border border-white/10 rounded-lg text-muted text-xs px-2 py-1.5 outline-none"
              >
                <option value="">{t.community.public}</option>
                {allSpaces.filter((s) => joinedSpaces.includes(s.slug)).map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>

              {/* Visibility selector */}
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'PUBLIC' | 'CONNECTIONS_ONLY')}
                className="bg-surface-light border border-white/10 rounded-lg text-muted text-xs px-2 py-1.5 outline-none"
                title={t.community.postVisibility}
              >
                <option value="PUBLIC">🌐 Public</option>
                <option value="CONNECTIONS_ONLY">👥 Connections</option>
              </select>
            </div>

            <button
              onClick={handlePost}
              disabled={!newPostText.trim() || isOverLimit || !pollValid || createPost.isPending}
              className={clsx(
                'px-4 py-2 rounded-xl font-heading font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none',
                newPostText.trim() && !isOverLimit && pollValid && !createPost.isPending
                  ? 'bg-accent text-white hover:bg-accent-glow'
                  : 'bg-surface-light text-muted cursor-not-allowed'
              )}
            >
              {createPost.isPending ? t.community.posting : t.community.post}
            </button>
          </div>
        </div>
      </div>
    </LazyMotionDiv>
  );
}
