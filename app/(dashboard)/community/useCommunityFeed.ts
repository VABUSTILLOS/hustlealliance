'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { CommunityPostItem, GetCommunityPostsResult } from '@/lib/db/community';

interface UseCommunityFeedOpts {
  sort?: 'latest' | 'popular';
  space?: string;
  limit?: number;
  initialData?: { pages: GetCommunityPostsResult[]; pageParams: (string | undefined)[] };
}

export function useCommunityFeed(opts: UseCommunityFeedOpts = {}) {
  const { sort = 'latest', space, limit = 20, initialData } = opts;

  return useInfiniteQuery<GetCommunityPostsResult>({
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
    initialData,
  });
}
