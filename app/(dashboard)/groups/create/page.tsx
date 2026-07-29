'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GroupCreator } from '../components/GroupCreator';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function CreateGroupPage() {
  const { t } = useTranslation();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-xl mx-auto">
      {/* Back */}
      <Link
        href="/groups"
        className="inline-flex items-center gap-1 text-muted font-mono text-xs hover:text-accent mb-6 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {t.spaces.backToSpaces}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
          {t.spaces.tag}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase leading-none">
          Create a Group
        </h1>
        <p className="text-muted text-sm mt-3">
          Start a new group for founders with shared interests, industries, or goals.
        </p>
      </motion.div>

      <GroupCreator />
    </div>
  );
}
