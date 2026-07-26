'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';
import { spaces } from '@/lib/data/spaces';
import { useStore } from '@/lib/store/useStore';

export default function SpaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const space = spaces.find((s) => s.slug === slug);
  const posts = useStore((s) => s.posts);
  const toggleLike = useStore((s) => s.toggleLike);
  const addComment = useStore((s) => s.addComment);
  const user = useStore((s) => s.currentUser);
  const isSpaceJoined = useStore((s) => s.isSpaceJoined);
  const toggleJoinSpace = useStore((s) => s.toggleJoinSpace);

  if (!space) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-white mb-4">Space not found</h1>
        <Link href="/spaces" className="text-accent font-mono text-sm hover:underline">← Back to Spaces</Link>
      </div>
    );
  }

  const joined = isSpaceJoined(slug);
  const spacePosts = posts.filter((p) => p.space === slug);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link href="/spaces" className="inline-flex items-center gap-1 text-muted font-mono text-xs hover:text-accent mb-6 transition-colors">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        All Spaces
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-48 rounded-2xl overflow-hidden mb-8"
      >
        <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="font-display text-3xl sm:text-4xl text-white uppercase leading-none mb-2">
            {space.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-muted text-sm">{space.memberCount} members</span>
            <button
              onClick={() => toggleJoinSpace(slug)}
              className={clsx(
                'px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all',
                joined
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-accent text-white hover:bg-accent-glow'
              )}
            >
              {joined ? 'Joined ✓' : 'Join Space'}
            </button>
          </div>
        </div>
      </motion.div>

      <p className="text-white/60 text-sm mb-8">{space.description}</p>

      {/* Feed */}
      <h2 className="font-heading font-bold text-white text-lg mb-4">Posts</h2>
      {spacePosts.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">No posts in this space yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {spacePosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-surface-light rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                <div>
                  <p className="font-heading font-bold text-white text-sm">{post.author.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[10px] text-muted">@{post.author.username}</p>
                    <span className="text-muted text-[10px]">•</span>
                    <p className="text-muted text-[10px]">{post.timestamp}</p>
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-3">{post.text}</p>
              {post.image && (
                <img src={post.image} alt="" className="w-full rounded-xl mb-3 max-h-80 object-cover" />
              )}
              <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5">
                <svg className={clsx('w-4 h-4', post.liked ? 'text-accent fill-accent' : 'text-muted')}
                  viewBox="0 0 24 24" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                <span className={clsx('text-xs font-mono', post.liked ? 'text-accent' : 'text-muted')}>{post.likes}</span>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
