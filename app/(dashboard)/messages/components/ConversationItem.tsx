"use client";

import Link from "next/link";
import type { ConversationItem } from "@/lib/db/messages";
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ConversationItemProps {
  conversation: ConversationItem;
  isActive: boolean;
  userId: string;
}

export function ConversationItem({ conversation, isActive, userId }: ConversationItemProps) {
  const { t } = useTranslation();
  // For 1-on-1 conversations, show the other user's name
  // For groups, show the group name
  const displayName = (() => {
    if (conversation.isGroup) return conversation.name || t.messages.groupChat;
    const other = conversation.participants.find((p) => p.user.id !== userId);
    return other?.user.name || other?.user.username || "Unknown";
  })();

  const displayAvatar = (() => {
    if (conversation.isGroup) {
      return "/default-group-avatar.png";
    }
    const other = conversation.participants.find((p) => p.user.id !== userId);
    return other?.user.avatar || null;
  })();

  const lastMessagePreview = conversation.lastMessage
    ? conversation.lastMessage.content.length > 40
      ? conversation.lastMessage.content.slice(0, 40) + "..."
      : conversation.lastMessage.content
    : t.messages.noMessagesYet;

  const timestamp = conversation.lastMessage
    ? formatTime(conversation.lastMessage.createdAt, t.messages.yesterday)
    : formatTime(conversation.createdAt, t.messages.yesterday);

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={`flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 ${
        isActive ? "bg-accent/10 border-accent" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        {conversation.isGroup && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px]">
            👥
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span
            className={`truncate text-sm font-medium ${
              conversation.unreadCount > 0 ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {displayName}
          </span>
          <span className="flex-shrink-0 text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate text-xs text-muted-foreground">{lastMessagePreview}</span>
          {conversation.unreadCount > 0 && (
            <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatTime(isoString: string, yesterdayLabel: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return yesterdayLabel;
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
