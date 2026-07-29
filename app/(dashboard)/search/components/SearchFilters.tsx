'use client';

import clsx from 'clsx';

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'users', label: 'Members' },
  { key: 'posts', label: 'Posts' },
  { key: 'groups', label: 'Groups' },
  { key: 'events', label: 'Events' },
  { key: 'jobs', label: 'Jobs' },
] as const;

interface SearchFiltersProps {
  active: string;
  onChange: (type: string) => void;
}

export function SearchFilters({ active, onChange }: SearchFiltersProps) {
  return (
    <div className="flex gap-1 p-1 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border-subtle)]">
      {FILTER_TABS.map((tab) => (
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
