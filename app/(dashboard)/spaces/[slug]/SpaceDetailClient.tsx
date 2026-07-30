'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { Space } from '@/lib/data/spaces';
import type { GetCommunityPostsResult } from '@/lib/db/community';
import { useCommunityFeed } from '../../community/useCommunityFeed';

export function SpaceDetailClient({
  slug,
  space,
  feed,
}: {
  slug: string;
  space: Space | null;
  feed: GetCommunityPostsResult;
}) {
  const { t } = useTranslation();
  const isSpaceJoined = useStore((s) => s.isSpaceJoined);
  const toggleJoinSpace = useStore((s) => s.toggleJoinSpace);

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

  const joined = isSpaceJoined(slug);

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
        <Image src={space.image} alt={space.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 700px" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase leading-none mb-2">
            {space.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-muted text-sm">{space.memberCount} {t.spaces.members}</span>
            <button
              onClick={() => toggleJoinSpace(slug)}
              className={clsx(
                'px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all',
                joined
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-accent text-foreground hover:bg-accent-glow'
              )}
            >
              {joined ? t.spaces.joined + ' ✓' : t.spaces.join + ' ' + t.spaces.tag}
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
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-surface-light rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <Image src={post.author.avatar ?? ''} alt="" width={40} height={40} className="rounded-full border border-white/10 object-cover" />
                <div>
                  <p className="font-heading font-bold text-foreground text-sm">{post.author.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[10px] text-muted">@{post.author.username}</p>
                    <span className="text-muted text-[10px]">•</span>
                    <p className="text-muted text-[10px]">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <p className="text-foreground-muted text-sm mb-3">{post.content}</p>
              {post.imageUrls.length > 0 && (
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3">
                  <Image src={post.imageUrls[0]} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 700px" />
                </div>
              )}
              <div className="flex items-center gap-4 text-xs font-mono text-muted">
                <span>❤️ {post.likeCount}</span>
                <span>💬 {post.commentCount}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
