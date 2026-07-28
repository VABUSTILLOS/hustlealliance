'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function StudyGroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[StudyGroup] Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-red-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="font-heading font-bold text-xl text-foreground mb-2">
          Something went wrong
        </h2>
        <p className="text-muted text-sm mb-6">
          {error.message === 'Not enrolled in this course'
            ? "You're not enrolled in this course. Enroll to access the study group."
            : 'There was an error loading the study group. Please try again.'}
        </p>
        {error.message !== 'Not enrolled in this course' && (
          <details className="mb-6 text-left">
            <summary className="text-xs text-muted cursor-pointer hover:text-foreground transition-colors">
              Error details
            </summary>
            <pre className="mt-2 p-3 bg-surface border border-surface-light rounded-xl text-xs text-red-400 overflow-auto max-h-40 whitespace-pre-wrap">
              {error.message}
              {error.stack ? '\n\n' + error.stack : ''}
            </pre>
          </details>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-sm uppercase tracking-wider"
          >
            Try again
          </button>
          <Link
            href="/learning"
            className="px-5 py-2.5 rounded-xl bg-surface border border-surface-light text-foreground-muted font-heading font-bold text-sm uppercase tracking-wider hover:text-foreground transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
