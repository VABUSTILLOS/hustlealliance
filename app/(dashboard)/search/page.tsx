'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchInput } from './components/SearchInput';
import { SearchResultsList } from './components/SearchResultsList';
import { SearchFilters } from './components/SearchFilters';
import { useSearch } from './components/hooks/useSearch';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function SearchPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') ?? '';
  const initialType = searchParams.get('type') ?? 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState(initialType);

  const { data, isLoading } = useSearch({ query: activeQuery, type: activeType });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveQuery(query);
      // Update URL
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (activeType !== 'all') params.set('type', activeType);
      const newUrl = params.toString() ? `/search?${params.toString()}` : '/search';
      router.replace(newUrl, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleTypeChange = useCallback(
    (type: string) => {
      setActiveType(type);
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (type !== 'all') params.set('type', type);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    },
    [query, router],
  );

  const results = data?.results ?? [];
  const activeTypeLabel =
    activeType === 'users'
      ? t.search.filterMembers
      : activeType === 'posts'
        ? t.search.filterPosts
        : activeType === 'groups'
          ? t.search.filterGroups
          : activeType === 'events'
            ? t.search.filterEvents
            : activeType === 'jobs'
              ? t.search.filterJobs
              : t.search.filterAll;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">{t.search.pageTitle}</h1>
        <p className="text-sm text-muted">{t.search.pageSubtitle}</p>
      </div>

      {/* Search input */}
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={t.search.placeholder}
        className="mb-4"
      />

      {/* Filters */}
      <div className="mb-6">
        <SearchFilters active={activeType} onChange={handleTypeChange} />
      </div>

      {/* Results */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && activeQuery.length >= 2 && (
        <>
          <div className="text-xs text-muted mb-4">
            {results.length} {t.search.resultsFor} &ldquo;{activeQuery}&rdquo;
            {activeType !== 'all' && (
              <span>
                {' '}
                <span className="text-foreground font-medium">
                  {t.search.inFilter.replace('{type}', activeTypeLabel)}
                </span>
              </span>
            )}
          </div>
          <SearchResultsList results={results} query={activeQuery} />
        </>
      )}

      {!isLoading && activeQuery.length < 2 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
            {t.search.emptyStateTitle}
          </h2>
          <p className="text-sm text-muted max-w-sm mx-auto">{t.search.emptyStateHelp}</p>
        </div>
      )}
    </div>
  );
}
