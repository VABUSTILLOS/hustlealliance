"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useMessages } from "@/lib/realtime/hooks/useMessages";
import type { PaginatedResult } from "@/lib/db/messages";
import type { MessagePayload } from "@/lib/realtime/supabase";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  type: string;
  content: string;
  attachmentUrl: string | null;
  createdAt: string;
  editedAt: string | null;
  sender: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
  reads: { userId: string; readAt: string }[];
}

interface UseChatMessagesOpts {
  conversationId: string;
  userId: string;
  limit?: number;
  enabled?: boolean;
}

export function useChatMessages({
  conversationId,
  userId,
  limit = 50,
  enabled = true,
}: UseChatMessagesOpts) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["messages", conversationId], [conversationId]);

  const query = useInfiniteQuery<PaginatedResult<MessageItem>>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      if (pageParam) params.set("cursor", pageParam as string);
      const res = await fetch(`/api/messages/conversations/${conversationId}/messages?${params}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchMessages"));
      return res.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    enabled: enabled && !!conversationId,
  });

  // Handle real-time messages: add new messages to cache
  const handleNewMessage = useCallback(
    (message: MessagePayload) => {
      if (message.sender_id === userId) return; // Already handled by the mutation

      // Check if we already have this message in cache
      const existing = queryClient.getQueryData<{
        pages: PaginatedResult<MessageItem>[];
        pageParams: (string | undefined)[];
      }>(queryKey);

      if (existing) {
        const messageExists = existing.pages.some((page) =>
          page.items.some((m) => m.id === message.id),
        );
        if (messageExists) return;

        // Add the new message to the first page
        queryClient.setQueryData(queryKey, {
          ...existing,
          pages: existing.pages.map((page, i) => {
            if (i === 0) {
              return {
                ...page,
                items: [
                  {
                    id: message.id,
                    conversationId: message.conversation_id,
                    senderId: message.sender_id,
                    type: message.type,
                    content: message.content,
                    attachmentUrl: message.attachment_url,
                    createdAt: message.created_at,
                    editedAt: message.edited_at,
                    sender: {
                      id: message.sender_id,
                      name: "Loading...",
                      username: null,
                      avatar: null,
                    },
                    reads: [],
                  },
                  ...page.items,
                ],
              };
            }
            return page;
          }),
        });
      }
    },
    [queryClient, queryKey, userId],
  );

  // Subscribe to real-time messages
  useMessages({
    conversationId,
    onNewMessage: handleNewMessage,
    enabled: enabled && !!conversationId,
  });

  return query;
}
