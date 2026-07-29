'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { LazyMotionDiv } from '@/lib/framer/lazy-motion';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { spaces as allSpaces } from '@/lib/data/spaces';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useCreatePost } from './hooks/useCreatePost';

export function PostCreator() {
  const user = useCurrentUser();
  const { t } = useTranslation();
  const createPost = useCreatePost();

  const [newPostText, setNewPostText] = useState('');
  const [newPostSpace, setNewPostSpace] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagePick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handlePost = useCallback(() => {
    if (!newPostText.trim() || createPost.isPending) return;
    createPost.mutate(
      {
        content: newPostText.trim(),
        space: newPostSpace || undefined,
        imageUrls: previewImage ? [previewImage] : undefined,
      },
      {
        onSuccess: () => {
          setNewPostText('');
          setPreviewImage(null);
          setNewPostSpace('');
        },
      }
    );
  }, [newPostText, newPostSpace, previewImage, createPost]);

  const isDisabled = !newPostText.trim() || createPost.isPending;

  return (
    <LazyMotionDiv
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface border border-surface-light rounded-2xl p-5 mb-6"
    >
      <div className="flex gap-3">
        <Image src={user?.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User'} alt="" width={40} height={40} className="rounded-full border border-white/10 object-cover shrink-0" />
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
              <Image src={previewImage} alt="Preview" width={400} height={300} className="max-h-48 rounded-lg" style={{ width: 'auto', height: 'auto' }} />
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
                {allSpaces.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handlePost}
              disabled={isDisabled}
              className={clsx(
                'px-4 py-2 rounded-xl font-heading font-bold text-sm transition-all',
                !isDisabled
                  ? 'bg-accent text-white hover:bg-accent-glow'
                  : 'bg-surface-light text-muted cursor-not-allowed'
              )}
            >
              {createPost.isPending ? t.community?.posting ?? 'Posting...' : t.community.post}
            </button>
          </div>
        </div>
      </div>
    </LazyMotionDiv>
  );
}
