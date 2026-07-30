'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function MembersHeader({ total }: { total: number }) {
  const { t } = useTranslation();
  const membersLabel = t.community.rolesMembers.toLowerCase();
  const memberLabel = total === 1 ? membersLabel.replace(/s$/, '') : membersLabel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">{t.community.headerLabel}</p>
      <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase leading-none">
        {t.community.rolesMembers}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-foreground-muted)] font-mono">
        {t.community.memberCount.replace('{total}', total.toLocaleString()).replace('{label}', memberLabel)}
      </p>
    </motion.div>
  );
}
