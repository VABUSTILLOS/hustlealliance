'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CommunityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Community section error:', error.message, error.stack);
  }, [error]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-24 max-w-lg mx-auto text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-6xl mb-4">🔧</div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Community Feed Unavailable
        </h2>
        <p className="text-muted text-sm mb-2">
          The community section hit a snag. This is usually temporary.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-muted mb-4">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-heading font-bold rounded-xl hover:bg-accent-glow transition-all"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
