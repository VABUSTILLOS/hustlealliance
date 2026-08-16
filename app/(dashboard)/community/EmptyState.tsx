'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

export const EmptyState = memo(function EmptyState({
  sort,
}: {
  sort: 'latest' | 'popular' | 'my-spaces';
}) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-4">💬</div>
      <h2 className="font-display text-2xl text-white uppercase mb-3">
        {sort === 'my-spaces' ? t.community.spacePostsEmpty : t.community.postsEmpty}
      </h2>
      <p className="text-foreground-muted text-sm mb-6 max-w-md mx-auto">
        {sort === 'my-spaces' ? t.community.spacePostsEmptyDescFull : t.community.postsEmptyDescFull}
      </p>
      {sort === 'my-spaces' ? (
        <Link
          href="/spaces"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-heading font-bold text-sm hover:shadow-[0_0_30px_rgba(255,59,48,0.3)] transition-all"
        >
          {t.community.discoverSpaces}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      ) : (
        <button
          onClick={() => document.querySelector('textarea')?.focus()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-heading font-bold text-sm hover:shadow-[0_0_30px_rgba(255,59,48,0.3)] transition-all"
        >
          {t.community.writePost}
        </button>
      )}
    </div>
  );
});
