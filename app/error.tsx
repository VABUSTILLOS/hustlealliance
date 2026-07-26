'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global app error:', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-7xl">💥</div>
          <h1 className="text-3xl font-heading font-bold text-[var(--color-foreground)]">
            Something went wrong
          </h1>
          <p className="text-[var(--color-muted)] text-sm">
            An unexpected error occurred. Try refreshing or head back to the dashboard.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="px-6 py-3 bg-[var(--color-accent)] text-white font-heading font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,59,48,0.3)] transition-all"
            >
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-[var(--color-surface-light)] text-[var(--color-foreground)] font-heading font-bold rounded-xl hover:bg-[var(--color-surface-light)] transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
