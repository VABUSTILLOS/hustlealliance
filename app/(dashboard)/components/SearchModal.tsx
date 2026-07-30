'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchInput } from '@/app/(dashboard)/search/components/SearchInput';
import { SearchResultsList } from '@/app/(dashboard)/search/components/SearchResultsList';
import { useSearch, useSearchSuggest } from '@/app/(dashboard)/search/components/hooks/useSearch';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { useTranslation } from '@/lib/i18n/useTranslation';

// ── Types ─────────────────────────────────────────────────────────────

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'hustle_recent_searches';
const MAX_RECENT = 5;

// ── Component ─────────────────────────────────────────────────────────

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(RECENT_SEARCHES_KEY, []);

  const { data: searchData, isLoading } = useSearch({ query: activeQuery });
  const { data: suggestData } = useSearchSuggest(query);

  const results = searchData?.results ?? [];
  const suggestions = suggestData?.suggestions ?? [];
  const suggestionTypeLabels: Record<string, string> = {
    user: t.search.typeLabelMembers,
    post: t.search.typeLabelPosts,
    group: t.search.typeLabelGroups,
    event: t.search.typeLabelEvents,
    job: t.search.typeLabelJobs,
  };

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Cmd+K / Esc keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Will be re-opened by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Debounced search — only fire after user stops typing for 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const saveRecent = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== trimmed);
        return [trimmed, ...filtered].slice(0, MAX_RECENT);
      });
    },
    [setRecentSearches],
  );

  const handleSubmit = useCallback(() => {
    if (query.trim().length < 2) return;
    saveRecent(query);
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }, [query, saveRecent, onClose, router]);

  const handleSelect = useCallback(() => {
    if (query.trim().length < 2) return;
    saveRecent(query);
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }, [query, saveRecent, onClose, router]);

  const handleRecentClick = (term: string) => {
    setQuery(term);
    setActiveQuery(term);
    saveRecent(term);
  };

  // Determine what to show: suggestions, results, recents, or empty
  const showResults = activeQuery.length >= 2 && results.length > 0;
  const showSuggestions = query.length >= 2 && activeQuery.length < 2 && suggestions.length > 0;
  const showRecents = query.length < 2 && recentSearches.length > 0;
  const showEmpty = query.length >= 2 && activeQuery.length >= 2 && results.length === 0 && !isLoading;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[15%] z-50 mx-auto max-w-lg px-4"
          >
            <div className="bg-[var(--color-bg)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="p-3 border-b border-[var(--color-border-subtle)]">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  onSubmit={handleSubmit}
                  placeholder={t.search.modalPlaceholder}
                  autoFocus
                  className="border-0 shadow-none"
                />
              </div>

              {/* Results / suggestions / recents */}
              <div className="max-h-[400px] overflow-y-auto">
                {isLoading && (
                  <div className="px-4 py-8 text-center">
                    <div className="inline-block w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  </div>
                )}

                {showResults && (
                  <SearchResultsList results={results} query={activeQuery} onSelect={onClose} />
                )}

                {showSuggestions && (
                  <div className="py-2">
                    <div className="px-4 py-2 text-[11px] font-semibold text-muted uppercase tracking-wider">
                      {t.search.suggestionsLabel}
                    </div>
                    {suggestions.map((s) => (
                      <button
                        key={`${s.entityType}-${s.entityId}`}
                        onClick={() => {
                          setQuery(s.title);
                          setActiveQuery(s.title);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-[var(--color-surface-light)] transition-colors flex items-center gap-2"
                      >
                        <svg className="w-3.5 h-3.5 text-muted flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <span>{s.title}</span>
                        <span className="text-[10px] text-muted ml-auto uppercase">
                          {suggestionTypeLabels[s.entityType] ?? s.entityType}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {showRecents && (
                  <div className="py-2">
                    <div className="px-4 py-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                        {t.search.recentSearchesLabel}
                      </span>
                      <button
                        onClick={() => setRecentSearches([])}
                        className="text-[10px] text-muted hover:text-accent transition-colors"
                      >
                        {t.search.clearAllButton}
                      </button>
                    </div>
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-[var(--color-surface-light)] transition-colors flex items-center gap-2"
                      >
                        <svg className="w-3.5 h-3.5 text-muted flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                )}

                {showEmpty && (
                  <div className="px-4 py-12 text-center">
                    <p className="text-muted text-sm">
                      {t.search.noResultsFor} &ldquo;<span className="font-medium text-foreground">{query}</span>&rdquo;
                    </p>
                  </div>
                )}

                {query.length < 2 && !showRecents && (
                  <div className="px-4 py-12 text-center">
                    <p className="text-muted text-xs">
                      {t.search.typeToSearch}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[10px] text-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-light)] text-[10px] font-mono">↑↓</kbd>
                    <span>{t.search.keyboardNavigate}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-light)] text-[10px] font-mono">{t.general.searchKbd}</kbd>
                    <span>{t.search.keyboardSearch}</span>
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-light)] text-[10px] font-mono">Esc</kbd>
                  <span>{t.search.keyboardClose}</span>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
