'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { GetCommunityPostsResult } from '@/lib/db/community';
import { useCommunityFeed } from '../../community/useCommunityFeed';
import { PostFeedCard } from './PostFeedCard';

type DetailSpace = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar: string | null;
  coverImage: string | null;
  memberCount: number;
  isJoined: boolean;
};

export function SpaceDetailClient({
  slug,
  space,
  feed,
}: {
  slug: string;
  space: DetailSpace | null;
  feed: GetCommunityPostsResult;
}) {
  const { t } = useTranslation();
  const [joined, setJoined] = useState<boolean | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (space) {
      setJoined(space.isJoined);
      setMemberCount(space.memberCount);
    }
  }, [space]);

  // Fetch posts from the database via React Query
  const query = useCommunityFeed({
    space: slug,
    initialData: { pages: [feed], pageParams: [undefined] },
    enabled: true,
  });

  const posts = query.data?.pages.flatMap((page) => page.items) ?? feed.items;

  if (!space) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-foreground mb-4">{t.spaces.notFound}</h1>
        <Link href="/spaces" className="text-accent font-mono text-sm hover:underline">← {t.spaces.backToSpaces}</Link>
      </div>
    );
  }

  const toggleJoin = async () => {
    if (joining) return;
    setJoining(true);
    setJoined((prev) => !prev);
    setMemberCount((prev) => (prev ?? space.memberCount) + (joined ? -1 : 1));
    try {
      const res = await fetch(`/api/spaces/${slug}/${joined ? 'leave' : 'join'}`, { method: 'POST' });
      if (!res.ok) {
        setJoined((prev) => !prev);
        setMemberCount((prev) => (prev ?? space.memberCount) + (joined ? 1 : -1));
      }
    } catch {
      setJoined((prev) => !prev);
      setMemberCount((prev) => (prev ?? space.memberCount) + (joined ? 1 : -1));
    } finally {
      setJoining(false);
    }
  };

  const isJoined = joined ?? false;
  const count = memberCount ?? space.memberCount;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link href="/spaces" className="inline-flex items-center gap-1 text-muted font-mono text-xs hover:text-accent mb-6 transition-colors">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        {t.spaces.allSpaces}
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-48 rounded-2xl overflow-hidden mb-8"
      >
        <Image src={space.coverImage || space.avatar || ''} alt={space.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 700px" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase leading-none mb-2">
            {space.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-muted text-sm">{count} {t.spaces.members}</span>
            <button
              onClick={toggleJoin}
              disabled={joining}
              className={clsx(
                'px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all disabled:opacity-60',
                isJoined
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-accent text-foreground hover:bg-accent-glow'
              )}
            >
              {isJoined ? t.spaces.joined + ' ✓' : t.spaces.join + ' ' + t.spaces.tag}
            </button>
          </div>
        </div>
      </motion.div>

      <p className="text-foreground-muted text-sm mb-8">{space.description}</p>

      {/* Feed */}
      <h2 className="font-heading font-bold text-foreground text-lg mb-4">{t.spaces.posts}</h2>
      {posts.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">{t.spaces.noPosts}</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostFeedCard key={post.id} post={post} spaceSlug={slug} />
          ))}
        </div>
      )}
    </div>
  );
}
