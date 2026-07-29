"use client";

import { useState, useCallback } from "react";
import { useConversations } from "./components/hooks/useConversations";
import { ConversationList } from "./components/ConversationList";
import { NewMessageModal } from "./components/NewMessageModal";

// Mock user for dev — replace with actual auth hook
const MOCK_USER_ID = "dev-user-id";

export default function MessagesPage() {
  const [showNewMessage, setShowNewMessage] = useState(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useConversations({ limit: 20 });

  const conversations =
    data?.pages.flatMap((page) => page.items) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left panel: Conversation list */}
      <div className="w-full border-r lg:w-80 xl:w-96">
        <ConversationList
          conversations={conversations}
          userId={MOCK_USER_ID}
          isLoading={isLoading}
          hasMore={!!hasNextPage}
          onLoadMore={handleLoadMore}
          onNewMessage={() => setShowNewMessage(true)}
        />
      </div>

      {/* Right panel: Placeholder (chat view rendered on [id] route) */}
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <div className="text-center">
          <div className="mb-3 text-5xl">💬</div>
          <h2 className="text-lg font-semibold">Select a conversation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a conversation from the left or start a new one
          </p>
        </div>
      </div>

      {/* New message modal */}
      <NewMessageModal
        isOpen={showNewMessage}
        onClose={() => setShowNewMessage(false)}
        userId={MOCK_USER_ID}
      />
    </div>
  );
}
