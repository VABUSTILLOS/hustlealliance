'use client';

import { useQuery } from '@tanstack/react-query';
import type { EntityType, SearchResult, SuggestResult } from '@/lib/db/search';

// ── Unified Search ────────────────────────────────────────────────────

export function useSearch(params: {
  query: string;
  type?: string; // "all" | "users" | "posts" | "groups" | "events" | "jobs"
  limit?: number;
}) {
  const { query, type = 'all', limit = 20 } = params;
  const enabled = query.trim().length >= 2;

  return useQuery<{ results: SearchResult[]; query: string; total: number }>({
    queryKey: ['search', query, type, limit],
    queryFn: async () => {
      const url = new URL('/api/search', window.location.origin);
      url.searchParams.set('q', query);
      url.searchParams.set('type', type);
      url.searchParams.set('limit', String(limit));
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

// ── Suggestions (autocomplete) ────────────────────────────────────────

export function useSearchSuggest(query: string) {
  const enabled = query.trim().length >= 2;

  return useQuery<{ suggestions: SuggestResult[]; query: string }>({
    queryKey: ['search', 'suggest', query],
    queryFn: async () => {
      const url = new URL('/api/search/suggest', window.location.origin);
      url.searchParams.set('q', query);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Suggest failed');
      return res.json();
    },
    enabled,
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
}

// ── Trending ──────────────────────────────────────────────────────────

export function useTrendingSearches() {
  return useQuery<{ trending: { term: string; count: number }[] }>({
    queryKey: ['search', 'trending'],
    queryFn: async () => {
      const url = new URL('/api/search/trending', window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Trending fetch failed');
      return res.json();
    },
    staleTime: 5 * 60_000, // 5 min
    refetchOnWindowFocus: false,
  });
}
