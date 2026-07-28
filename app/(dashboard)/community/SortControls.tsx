'use client';

import { memo } from 'react';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

type SortMode = 'latest' | 'popular' | 'my-spaces';

export const SortControls = memo(function SortControls({
  sort,
  onSortChange,
}: {
  sort: SortMode;
  onSortChange: (mode: SortMode) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 mb-6">
      {(['latest', 'popular', 'my-spaces'] as SortMode[]).map((mode) => (
        <button
          key={mode}
          onClick={() => onSortChange(mode)}
          className={clsx(
            'px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all',
            sort === mode
              ? 'bg-accent/20 text-foreground border border-accent/40'
              : 'text-muted border border-foreground-dim hover:text-foreground'
          )}
        >
          {mode === 'latest' ? t.community.sortLatest : mode === 'popular' ? t.community.sortPopular : t.community.sortMySpaces}
        </button>
      ))}
    </div>
  );
});
