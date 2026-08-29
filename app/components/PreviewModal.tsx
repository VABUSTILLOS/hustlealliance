'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { KeyInsight } from '@/lib/data/gamification';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  insights: KeyInsight[];
}

export default function PreviewModal({ isOpen, onClose, title, slug, insights }: Props) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full sm:max-w-lg max-h-[85vh] overflow-y-auto
              bg-surface border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 mx-0 sm:mx-4"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Handle bar for mobile */}
            <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t.resourceViewer.quickPreview}</h2>
                <p className="text-foreground-dim text-sm mt-1">{title}</p>
              </div>
              <button
                onClick={onClose}
                className="text-foreground-muted hover:text-foreground transition-colors p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Insight Cards */}
            <div className="space-y-3 mb-6">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10
                    hover:border-accent/30 hover:bg-white/[0.07] transition-all group"
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    {insight.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-foreground-dim text-sm leading-relaxed">
                      {insight.insight}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Free lesson teaser section */}
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 mb-6">
              <p className="text-foreground-dim text-sm text-center mb-3">
                {t.resourceViewer.firstLessonBefore}{' '}
                <strong className="text-foreground">{t.resourceViewer.free}</strong>{' '}
                {t.resourceViewer.firstLessonAfter}
              </p>
              <Link
                href={`/preview/${slug}`}
                onClick={onClose}
                className="flex items-center gap-2 text-accent text-sm justify-center hover:underline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-medium">{t.resourceViewer.startFreePreview}</span>
              </Link>
            </div>

            {/* CTA */}
            <Link
              href={`/preview/${slug}`}
              onClick={onClose}
              className="block w-full py-3 rounded-xl bg-accent text-white font-semibold text-center
                hover:shadow-lg hover:shadow-accent/30 transition-all active:scale-[0.98]"
            >
              {t.resourceViewer.startFreeLesson}
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
