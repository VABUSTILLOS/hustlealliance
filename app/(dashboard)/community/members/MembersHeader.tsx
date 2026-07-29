'use client';

import { motion } from 'framer-motion';

export function MembersHeader({ total }: { total: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">Community</p>
      <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase leading-none">
        Members
      </h1>
      <p className="mt-2 text-sm text-[var(--color-foreground-muted)] font-mono">
        {total.toLocaleString()} {total === 1 ? 'member' : 'members'} in the community
      </p>
    </motion.div>
  );
}
