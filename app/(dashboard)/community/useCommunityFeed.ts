'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { CommunityPostItem } from '@/lib/db/community';

interface FeedPage {
  items: CommunityPostItem[];
  hasMore: boolean;
  nextCursor: string | null;
}

interface UseCommunityFeedOpts {
  sort?: 'latest' | 'popular';
  space?: string;
  limit?: number;
}

export function useCommunityFeed(opts: UseCommunityFeedOpts = {}) {
  const { sort = 'latest', space, limit = 20 } = opts;

  return useInfiniteQuery<FeedPage>({
    queryKey: ['community-feed', { sort, space }],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set('sort', sort);
      params.set('limit', String(limit));
      if (pageParam) params.set('cursor', pageParam as string);
      if (space) params.set('space', space);

      const res = await fetch(`/api/community/feed?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch feed');
      return res.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
