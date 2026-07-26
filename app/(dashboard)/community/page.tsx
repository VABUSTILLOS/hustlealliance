'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';
import { useStore } from '@/lib/store/useStore';
import { spaces as allSpaces } from '@/lib/data/spaces';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { FeedPost, Comment } from '@/lib/data/community';

type SortMode = 'latest' | 'popular' | 'my-spaces';

export default function CommunityPage() {
  const posts = useStore((s) => s.posts);
  const toggleLike = useStore((s) => s.toggleLike);
  const addComment = useStore((s) => s.addComment);
  const addPost = useStore((s) => s.addPost);
  const joinedSpaces = useStore((s) => s.joinedSpaces);
  const user = useStore((s) => s.currentUser);

  const [sort, setSort] = useState<SortMode>('latest');
  const [newPostText, setNewPostText] = useState('');
  const [newPostSpace, setNewPostSpace] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [visibleCount, setVisibleCount] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // Sort posts
  const sorted = [...posts].sort((a, b) => {
    if (sort === 'popular') return b.likes - a.likes;
    return 0; // already in order for 'latest'
  });

  // Filter by my spaces
  const filtered = sort === 'my-spaces'
    ? sorted.filter((p) => !p.space || joinedSpaces.includes(p.space))
    : sorted;

  const visible = filtered.slice(0, visibleCount);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!newPostText.trim()) return;
    const newPost: FeedPost = {
      id: String(Date.now()),
      author: { username: user?.username ?? 'member', name: user?.name ?? 'Member', avatar: user?.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User' },
      text: newPostText,
      image: previewImage || undefined,
      timestamp: 'Just now',
      likes: 0,
      liked: false,
      comments: [],
      space: newPostSpace || undefined,
    };
    addPost(newPost);
    setNewPostText('');
    setPreviewImage(null);
    setNewPostSpace('');
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">{t.community.tag}</p>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase leading-none">
          {t.community.headline}
        </h1>
      </motion.div>

      {/* Post Creation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-surface-light rounded-2xl p-5 mb-6"
      >
        <div className="flex gap-3">
          <img src={user?.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User'} alt="" className="w-10 h-10 rounded-full border border-white/10 object-cover shrink-0" />
          <div className="flex-1 space-y-3">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={t.community.createPost}
              rows={3}
              className="w-full bg-transparent text-foreground placeholder:text-muted text-sm resize-none outline-none"
            />
            {previewImage && (
              <div className="relative inline-block">
                <img src={previewImage} alt="Preview" className="max-h-48 rounded-lg" />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-light transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
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
              </div>
              <button
                onClick={handlePost}
                disabled={!newPostText.trim()}
                className={clsx(
                  'px-4 py-2 rounded-xl font-heading font-bold text-sm transition-all',
                  newPostText.trim()
                    ? 'bg-accent text-white hover:bg-accent-glow'
                    : 'bg-surface-light text-muted cursor-not-allowed'
                )}
              >
                {t.community.post}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-6">
        {(['latest', 'popular', 'my-spaces'] as SortMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setSort(mode)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all',
              sort === mode
                ? 'bg-accent/20 text-foreground border border-accent/40'
                : 'text-muted border border-foreground-dim hover:text-foreground'
            )}
          >
            {mode === 'latest' ? t.community.sortLatest : mode === 'popular' ? t.community.sortPopular : t.community.sortMySpaces}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {visible.length > 0 ? visible.map((post) => {
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
                  <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
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
                  <img src={post.image} alt="" className="w-full rounded-xl mb-3 max-h-96 object-cover" loading="lazy" />
                )}

                {/* Actions */}
                <div className="flex items-center gap-6">
                  <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 group">
                    <svg className={clsx('w-4 h-4 transition-colors', post.liked ? 'text-accent fill-accent' : 'text-muted group-hover:text-accent')}
                      viewBox="0 0 24 24" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    <span className={clsx('text-xs font-mono', post.liked ? 'text-accent' : 'text-muted')}>{post.likes}</span>
                  </button>
                  <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <span className="text-xs font-mono">{post.comments.length}</span>
                  </button>
                </div>

                {/* Comments section */}
                <AnimatePresence>
                  {commentsOpen && (
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
                              value={commentTexts[post.id] || ''}
                              onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                              placeholder={t.community.writeComment}
                              className="flex-1 bg-surface-light rounded-xl px-3 py-1.5 text-foreground text-xs outline-none placeholder:text-muted"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="text-accent font-mono text-xs font-bold hover:text-accent-glow"
                            >
                              {t.community.submit}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }) : (
            /* Empty state */
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
          )}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {visibleCount < filtered.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-8">
          <button
            onClick={() => setVisibleCount((c) => c + 5)}
            className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all"
          >
            {t.community.loadMore}
          </button>
        </motion.div>
      )}
    </div>
  );
}
