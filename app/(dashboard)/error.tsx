'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error('Dashboard section error:', error);
  }, [error]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-24 max-w-lg mx-auto text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          {t.general.dashboardErrorTitle}
        </h2>
        <p className="text-muted text-sm mb-6">
          {t.general.dashboardErrorMessage}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-heading font-bold rounded-xl hover:bg-accent-glow transition-all shadow-[0_0_20px_rgba(255,59,48,0.3)]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
          {t.general.dashboardButtonTryAgain}
        </button>
      </motion.div>
    </div>
  );
}
