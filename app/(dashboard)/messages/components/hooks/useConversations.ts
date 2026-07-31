"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginatedResult, ConversationItem } from "@/lib/db/messages";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

interface UseConversationsOpts {
  limit?: number;
}

export function useConversations(opts: UseConversationsOpts = {}) {
  const { limit = 20 } = opts;

  return useInfiniteQuery<PaginatedResult<ConversationItem>>({
    queryKey: ["conversations"],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      if (pageParam) params.set("cursor", pageParam as string);
      const res = await fetch(`/api/messages/conversations?${params}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchConversations"));
      return res.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  });
}
