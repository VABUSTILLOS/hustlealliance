"use client";

import { ConversationItem } from "./ConversationItem";
import type { ConversationItem as ConversationItemType } from "@/lib/db/messages";

interface ConversationListProps {
  conversations: ConversationItemType[];
  activeId?: string;
  userId: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onNewMessage: () => void;
}

export function ConversationList({
  conversations,
  activeId,
  userId,
  isLoading,
  hasMore,
  onLoadMore,
  onNewMessage,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex animate-pulse items-center gap-3 rounded-lg p-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-40 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="text-lg font-semibold">Messages</h2>
        <button
          onClick={onNewMessage}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <button
              onClick={onNewMessage}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Start a conversation
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeId}
                userId={userId}
              />
            ))}
          </div>
        )}

        {hasMore && onLoadMore && (
          <button
            onClick={onLoadMore}
            className="mt-3 w-full rounded-md py-2 text-center text-xs text-muted-foreground hover:text-foreground"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
