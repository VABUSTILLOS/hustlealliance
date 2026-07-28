'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function CommunityHeader() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">{t.community.tag}</p>
      <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase leading-none">
        {t.community.headline}
      </h1>
    </motion.div>
  );
}
