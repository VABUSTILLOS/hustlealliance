'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

type Space = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar: string | null;
  coverImage: string | null;
  memberCount: number;
  isJoined: boolean;
};

export default function SpacesPage() {
  const { t, locale } = useTranslation();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningSlug, setJoiningSlug] = useState<string | null>(null);

  const fetchSpaces = useCallback(async () => {
    try {
      const res = await fetch('/api/spaces');
      if (!res.ok) throw new Error('Failed to load spaces');
      const data = await res.json();
      setSpaces(data.spaces || []);
    } catch (err) {
      console.error('[spaces] Failed to load:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSpaces(); }, [fetchSpaces]);

  const toggleJoin = async (space: Space) => {
    if (joiningSlug) return;
    setJoiningSlug(space.slug);
    // Optimistic update.
    setSpaces((prev) =>
      prev.map((s) =>
        s.slug === space.slug
          ? { ...s, isJoined: !s.isJoined, memberCount: s.memberCount + (s.isJoined ? -1 : 1) }
          : s
      )
    );
    try {
      const res = await fetch(`/api/spaces/${space.slug}/${space.isJoined ? 'leave' : 'join'}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update membership');
      }
    } catch (err) {
      console.error('[spaces] Join failed:', err);
      // Roll back on failure.
      await fetchSpaces();
    } finally {
      setJoiningSlug(null);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">{t.spaces.tag}</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase leading-none">{t.spaces.headline}</h1>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-surface border border-surface-light animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const hasJoinedAny = spaces.some((s) => s.isJoined);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">{t.spaces.tag}</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase leading-none">
          {t.spaces.headline}
        </h1>
      </motion.div>

      {!hasJoinedAny && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-accent)]/20 text-center"
        >
          <div className="text-5xl mb-3">👥</div>
          <h2 className="font-display text-xl text-[var(--color-foreground)] uppercase mb-2">
            {locale === 'es' ? 'Encuentra tu tribu' : 'Find your crew'}
          </h2>
          <p className="text-[var(--color-foreground-muted)] text-sm max-w-md mx-auto">
            {locale === 'es'
              ? 'Los espacios son donde fundadores como tú se conectan por industria, etapa o identidad. Únete a algunos para ver publicaciones de personas que entienden lo que estás construyendo.'
              : 'Spaces are where founders like you connect by industry, stage, or identity. Join a few to see posts from people who get what you\'re building.'}
          </p>
        </motion.div>
      )}

      {spaces.length === 0 && (
        <p className="text-muted text-sm">{t.spaces.noSpaces}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {spaces.map((space, i) => {
          const joined = space.isJoined;
          return (
            <motion.div
              key={space.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={`/spaces/${space.slug}`} className="block group">
                <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-accent/20 hover:shadow-[0_20px_60px_rgba(255,59,48,0.08)]">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={space.coverImage || space.avatar || ''} alt={space.name}
                      fill className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-foreground text-lg mb-1 group-hover:text-accent transition-colors">
                      {space.name}
                    </h3>
                    <p className="text-muted text-sm mb-4 line-clamp-2">
                      {space.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-muted text-xs font-mono">{space.memberCount} {t.spaces.members}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleJoin(space);
                        }}
                        disabled={joiningSlug === space.slug}
                        className={clsx(
                          'px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all disabled:opacity-60',
                          joined
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20'
                        )}
                      >
                        {joined ? t.spaces.joined + ' ✓' : t.spaces.join}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
