'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGroups } from './components/hooks/useGroups';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Image from 'next/image';

export default function GroupsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState('');
  const [myGroups, setMyGroups] = useState(false);

  const { data: groups, isLoading } = useGroups({
    query: search || undefined,
    visibility: visibility || undefined,
    my: myGroups,
  });

  // Since hooks can't be called in a map easily, we use a simpler approach below
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
          {t.spaces.tag}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase leading-none">
            {t.spaces.headline}
          </h1>
          <button
            onClick={() => router.push('/groups/create')}
            className="px-5 py-2.5 rounded-xl bg-accent text-foreground font-heading font-bold text-sm uppercase hover:bg-accent-glow transition-all shrink-0"
          >
            + Create Group
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-surface-light rounded-xl text-sm text-foreground placeholder:text-muted outline-none focus:border-accent/30"
          />
        </div>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="px-3 py-2.5 bg-surface border border-surface-light rounded-xl text-sm text-muted outline-none focus:border-accent/30"
        >
          <option value="">All Visibility</option>
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>
        <button
          onClick={() => setMyGroups(!myGroups)}
          className={`px-4 py-2.5 rounded-xl text-sm font-mono font-bold uppercase border transition-all ${
            myGroups
              ? 'bg-accent/10 border-accent text-accent'
              : 'bg-surface border-surface-light text-muted hover:border-accent/20'
          }`}
        >
          {t.dashboard.mySpaces}
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface border border-surface-light rounded-2xl overflow-hidden animate-pulse">
              <div className="h-40 bg-surface-light" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-surface-light rounded w-2/3" />
                <div className="h-4 bg-surface-light rounded w-full" />
                <div className="h-4 bg-surface-light rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!groups || groups.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">👥</div>
          <h2 className="font-display text-2xl text-foreground uppercase mb-3">
            {t.spaces.noSpaces}
          </h2>
          <p className="text-muted text-sm max-w-md mx-auto mb-6">
            {myGroups
              ? "You haven't joined any groups yet. Browse the directory to find your crew."
              : 'No groups found matching your filters.'}
          </p>
          {!myGroups && (
            <button
              onClick={() => router.push('/groups/create')}
              className="px-6 py-3 rounded-xl bg-accent text-foreground font-heading font-bold text-sm uppercase hover:bg-accent-glow transition-all"
            >
              Create the First Group
            </button>
          )}
        </motion.div>
      )}

      {/* Grid — simplified: use links without per-card mutation hooks */}
      {!isLoading && groups && groups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {groups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={`/groups/${group.slug}`} className="block group">
                <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-accent/20 hover:shadow-[0_20px_60px_rgba(255,59,48,0.08)]">
                  <div className="relative h-40 overflow-hidden bg-surface-light">
                    {group.coverImage ? (
                      <Image
                        src={group.coverImage}
                        alt={group.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                        👥
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-foreground text-lg mb-1 group-hover:text-accent transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-muted text-sm mb-4 line-clamp-2">
                      {group.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-muted text-xs font-mono">
                        {group.memberCount} {t.spaces.members}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
