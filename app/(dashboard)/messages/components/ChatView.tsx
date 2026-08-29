"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import type { ConversationDetail } from "@/lib/db/messages";
import { useTranslation } from '@/lib/i18n/useTranslation';

interface MessageItem {
  id: string;
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

interface ChatViewProps {
  conversation: ConversationDetail;
  userId: string;
  messages: MessageItem[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onSendMessage: (content: string) => void;
  isSending: boolean;
  onTyping: () => void;
  typingNames: string[];
}

export function ChatView({
  conversation,
  userId,
  messages,
  hasMore,
  isLoading,
  onLoadMore,
  onSendMessage,
  isSending,
  onTyping,
  typingNames,
}: ChatViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevMessageCountRef = useRef(messages.length);

  const myParticipant = conversation.participants.find((p) => p.user.id === userId);
  const [muted, setMuted] = useState(!!myParticipant?.mutedAt);
  const [mutePending, setMutePending] = useState(false);

  const toggleMute = useCallback(async () => {
    if (mutePending) return;
    setMutePending(true);
    try {
      const res = await fetch(`/api/messages/conversations/${conversation.id}/mute`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setMuted(!!data.muted);
      }
    } finally {
      setMutePending(false);
    }
  }, [conversation.id, mutePending]);

  // Determine if user is near the bottom
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setShouldAutoScroll(scrollHeight - scrollTop - clientHeight < 100);
  }, []);

  // Auto-scroll to bottom on new messages (when near bottom)
  useEffect(() => {
    if (shouldAutoScroll && messages.length > prevMessageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, shouldAutoScroll]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!isLoading && messages.length > 0 && prevMessageCountRef.current === 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [isLoading, messages.length]);

  const displayName = (() => {
    if (conversation.isGroup) return conversation.name || t.messages.groupChat;
    const other = conversation.participants.find((p) => p.user.id !== userId);
    return other?.user.name || other?.user.username || "Unknown";
  })();

  const formatDateHeader = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return t.messages.today;
    if (date.toDateString() === yesterday.toDateString()) return t.messages.yesterday;
    return date.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
  };

  // Group messages by date for date separators
  const groupedMessages = [] as { date: string; messages: MessageItem[] }[];
  let currentDate = "";

  // Messages come in descending order (newest first), we need to reverse for display
  const displayMessages = [...messages].reverse();

  for (const msg of displayMessages) {
    const msgDate = new Date(msg.createdAt).toLocaleDateString();
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ date: msgDate, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <button
          onClick={() => router.push("/messages")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted lg:hidden"
        >
          ←
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold">{displayName}</h3>
            <p className="text-xs text-muted-foreground">
              {conversation.isGroup
                ? `${conversation.participants.length} ${t.messages.members}`
                : t.messages.directMessage}
            </p>
          </div>
        </div>

        <button
          onClick={toggleMute}
          disabled={mutePending}
          title={muted ? (t.messages?.unmute ?? "Unmute") : (t.messages?.mute ?? "Mute")}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          {muted ? "🔕" : "🔔"}
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3"
      >
        {hasMore && (
          <div className="mb-4 text-center">
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="rounded-full bg-muted px-4 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {isLoading ? t.messages.loading : t.messages.loadOlderMessages}
            </button>
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`h-8 animate-pulse rounded-2xl bg-muted ${
                      i % 2 === 0 ? "w-48" : "w-32"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">{t.messages.noMessagesYet}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.messages.startConversationHint}</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              <div className="mb-3 flex items-center gap-2">
                <hr className="flex-1 border-t" />
                <span className="text-xs text-muted-foreground">{formatDateHeader(group.date)}</span>
                <hr className="flex-1 border-t" />
              </div>
              {group.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  createdAt={msg.createdAt}
                  isOwn={msg.senderId === userId}
                  senderName={msg.sender.name}
                  senderAvatar={msg.sender.avatar}
                  attachmentUrl={msg.attachmentUrl}
                  isRead={msg.reads.length > 0}
                />
              ))}
            </div>
          ))
        )}

        <TypingIndicator names={typingNames} />
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={onSendMessage}
        onTyping={onTyping}
        disabled={isSending}
      />
    </div>
  );
}
