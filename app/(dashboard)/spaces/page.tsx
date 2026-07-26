'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';
import { spaces } from '@/lib/data/spaces';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function SpacesPage() {
  const { t } = useTranslation();
  const joinedSpaces = useStore((s) => s.joinedSpaces);
  const toggleJoinSpace = useStore((s) => s.toggleJoinSpace);
  const isSpaceJoined = useStore((s) => s.isSpaceJoined);

  const hasJoinedAny = joinedSpaces.length > 0;

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

      {/* Empty state — no spaces joined */}
      {!hasJoinedAny && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-accent)]/20 text-center"
        >
          <div className="text-5xl mb-3">👥</div>
          <h2 className="font-display text-xl text-[var(--color-foreground)] uppercase mb-2">
            Find your crew
          </h2>
          <p className="text-[var(--color-foreground-muted)] text-sm max-w-md mx-auto">
            Spaces are where founders like you connect by industry, stage, or identity.
            Join a few to see posts from people who get what you&apos;re building.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {spaces.map((space, i) => {
          const joined = isSpaceJoined(space.slug);
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
                    <img src={space.image} alt={space.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-foreground text-lg mb-1 group-hover:text-accent transition-colors">
                      {space.name}
                    </h3>
                    <p className="text-muted text-sm mb-4 line-clamp-2">{space.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {space.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-surface-light text-muted text-[10px] font-mono uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted text-xs font-mono">{space.memberCount} {t.spaces.members}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleJoinSpace(space.slug);
                        }}
                        className={clsx(
                          'px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all',
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
