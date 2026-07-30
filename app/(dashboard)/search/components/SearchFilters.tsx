'use client';

import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface SearchFiltersProps {
  active: string;
  onChange: (type: string) => void;
}

export function SearchFilters({ active, onChange }: SearchFiltersProps) {
  const { t } = useTranslation();
  const filterTabs = [
    { key: 'all', label: t.search.filterAll },
    { key: 'users', label: t.search.filterMembers },
    { key: 'posts', label: t.search.filterPosts },
    { key: 'groups', label: t.search.filterGroups },
    { key: 'events', label: t.search.filterEvents },
    { key: 'jobs', label: t.search.filterJobs },
  ] as const;

  return (
    <div className="flex gap-1 p-1 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border-subtle)]">
      {filterTabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
            active === tab.key
              ? 'bg-accent text-white shadow-sm'
              : 'text-muted hover:text-foreground hover:bg-[var(--color-surface-light)]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
