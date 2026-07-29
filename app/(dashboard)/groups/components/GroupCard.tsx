'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface GroupCardProps {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  memberCount: number;
  currentUserMember?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  joinPending?: boolean;
  index?: number;
}

export function GroupCard({
  slug,
  name,
  description,
  coverImage,
  memberCount,
  currentUserMember,
  onJoin,
  onLeave,
  joinPending,
  index = 0,
}: GroupCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/groups/${slug}`} className="block group">
        <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-accent/20 hover:shadow-[0_20px_60px_rgba(255,59,48,0.08)]">
          <div className="relative h-40 overflow-hidden bg-surface-light">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
              {name}
            </h3>
            <p className="text-muted text-sm mb-4 line-clamp-2">
              {description || t.spaces.noSpaces}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-muted text-xs font-mono">
                {memberCount} {t.spaces.members}
              </span>
              {onJoin && !currentUserMember && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onJoin();
                  }}
                  disabled={joinPending}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all',
                    'bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20',
                    joinPending && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {joinPending ? '...' : t.spaces.join}
                </button>
              )}
              {onLeave && currentUserMember && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLeave();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                >
                  {t.spaces.joined} ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
