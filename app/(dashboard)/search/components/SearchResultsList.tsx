'use client';

import type { SearchResult } from '@/lib/db/search';
import { SearchResultItem } from './SearchResultItem';

const TYPE_LABELS: Record<string, string> = {
  user: 'Members',
  post: 'Posts',
  group: 'Groups',
  event: 'Events',
  job: 'Jobs',
};

const TYPE_ORDER = ['user', 'post', 'group', 'event', 'job'];

interface SearchResultsListProps {
  results: SearchResult[];
  query: string;
  onSelect?: () => void;
}

export function SearchResultsList({ results, query, onSelect }: SearchResultsListProps) {
  if (!results.length) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted text-sm">
          No results for &ldquo;<span className="font-medium text-foreground">{query}</span>&rdquo;
        </p>
      </div>
    );
  }

  // Group by type
  const grouped = new Map<string, SearchResult[]>();
  for (const r of results) {
    const list = grouped.get(r.entityType) ?? [];
    list.push(r);
    grouped.set(r.entityType, list);
  }

  // Sort groups by predefined order
  const sortedGroups = TYPE_ORDER.filter((t) => grouped.has(t));

  return (
    <div className="py-2">
      {sortedGroups.map((type) => {
        const items = grouped.get(type)!;
        return (
          <div key={type}>
            <div className="px-4 py-2 text-[11px] font-semibold text-muted uppercase tracking-wider">
              {TYPE_LABELS[type] ?? type}
              <span className="ml-1 text-[10px] font-normal">({items.length})</span>
            </div>
            {items.map((item) => (
              <SearchResultItem key={`${item.entityType}-${item.entityId}`} result={item} onSelect={onSelect} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
