"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

export interface FeedItem {
  id: string;
  type: string;
  entityType: string;
  entityId: string;
  actorId: string;
  ownerId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
}

export function usePersonalFeed({ enabled = true }: { enabled?: boolean } = {}) {
  return useInfiniteQuery<FeedItem[]>({
    queryKey: ["personal-feed"],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", "20");
      if (pageParam) params.set("cursor", pageParam as string);
      const res = await fetch(`/api/feed?${params.toString()}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchPersonalFeed"));
      return res.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.length) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    enabled,
  });
}

export interface GlobalFeedPost {
  id: string;
  content: string;
  visibility: string;
  groupId: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
  _count: { likes: number; comments: number };
}

export function useGlobalFeed({ enabled = true }: { enabled?: boolean } = {}) {
  return useInfiniteQuery<GlobalFeedPost[]>({
    queryKey: ["global-feed"],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", "20");
      if (pageParam) params.set("cursor", pageParam as string);
      const res = await fetch(`/api/feed/global?${params.toString()}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchGlobalFeed"));
      return res.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.length) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    enabled,
  });
}
