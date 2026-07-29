"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConversations } from "../components/hooks/useConversations";
import { useChatMessages } from "../components/hooks/useChatMessages";
import { useTypingIndicator } from "@/lib/realtime/hooks/useTypingIndicator";
import { ConversationList } from "../components/ConversationList";
import { ChatView } from "../components/ChatView";
import { NewMessageModal } from "../components/NewMessageModal";
import type { ConversationDetail } from "@/lib/db/messages";

// Mock user for dev
const MOCK_USER_ID = "dev-user-id";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const conversationId = params.id as string;
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Fetch conversation detail
  const { data: conversation, isLoading: convLoading } = useQuery<ConversationDetail>({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const res = await fetch(`/api/messages/conversations/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return res.json();
    },
    enabled: !!conversationId,
    staleTime: 30_000,
  });

  // Fetch messages with real-time
  const {
    data: messagesData,
    isLoading: msgsLoading,
    fetchNextPage,
    hasNextPage,
  } = useChatMessages({
    conversationId,
    userId: MOCK_USER_ID,
    limit: 50,
    enabled: !!conversationId,
  });

  // Fetch conversation list for left panel
  const {
    data: conversationsData,
    isLoading: convsLoading,
    fetchNextPage: fetchNextConv,
    hasNextPage: hasNextConv,
  } = useConversations({ limit: 20 });

  const conversations =
    conversationsData?.pages.flatMap((page) => page.items) ?? [];

  const messages =
    messagesData?.pages.flatMap((page) => page.items) ?? [];

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: (newMessage) => {
      // Add the new message to the cache
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: unknown) => {
          if (!old) return old;
          const typed = old as { pages: { items: unknown[]; hasMore: boolean; nextCursor: string | null }[]; pageParams: (string | undefined)[] };
          return {
            ...typed,
            pages: typed.pages.map((page, i) => {
              if (i === 0) {
                return { ...page, items: [newMessage, ...page.items] };
              }
              return page;
            }),
          };
        },
      );
      // Mark conversation as read
      fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: newMessage.id }),
      }).catch(() => {});
    },
  });

  // Typing indicator
  const { typingUserIds, sendTyping } = useTypingIndicator({
    conversationId,
    userId: MOCK_USER_ID,
    enabled: !!conversationId,
  });

  const typingNames: string[] = typingUserIds; // In a real app, resolve userIds to names

  const handleSendMessage = useCallback(
    (content: string) => {
      sendMutation.mutate(content);
    },
    [sendMutation],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const handleLoadMoreConvs = useCallback(() => {
    if (hasNextConv) fetchNextConv();
  }, [hasNextConv, fetchNextConv]);

  // If conversation not found
  if (!convLoading && !conversation) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Conversation not found</p>
          <button
            onClick={() => router.push("/messages")}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Back to messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left panel */}
      <div className="hidden w-80 border-r xl:block xl:w-96">
        <ConversationList
          conversations={conversations}
          activeId={conversationId}
          userId={MOCK_USER_ID}
          isLoading={convsLoading}
          hasMore={!!hasNextConv}
          onLoadMore={handleLoadMoreConvs}
          onNewMessage={() => setShowNewMessage(true)}
        />
      </div>

      {/* Chat view */}
      <div className="flex flex-1 flex-col">
        {conversation ? (
          <ChatView
            conversation={conversation}
            userId={MOCK_USER_ID}
            messages={messages}
            hasMore={!!hasNextPage}
            isLoading={msgsLoading}
            onLoadMore={handleLoadMore}
            onSendMessage={handleSendMessage}
            isSending={sendMutation.isPending}
            onTyping={sendTyping}
            typingNames={typingNames}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      <NewMessageModal
        isOpen={showNewMessage}
        onClose={() => setShowNewMessage(false)}
        userId={MOCK_USER_ID}
      />
    </div>
  );
}
