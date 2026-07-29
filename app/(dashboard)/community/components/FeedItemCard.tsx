'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { FeedItem } from '../hooks/useFeeds';

const TYPE_ICONS: Record<string, string> = {
  POST_CREATED: '📝',
  POST_LIKED: '❤️',
  COMMENT_CREATED: '💬',
  USER_FOLLOWED: '👋',
  FRIEND_ACCEPTED: '🤝',
  GROUP_JOINED: '👥',
  EVENT_CREATED: '📅',
  EVENT_RSVP: '✅',
  BADGE_EARNED: '🏆',
  JOB_POSTED: '💼',
  PRODUCT_LISTED: '🛍️',
};

const TYPE_MESSAGES: Record<string, string> = {
  POST_CREATED: 'shared a new post',
  POST_LIKED: 'liked a post',
  COMMENT_CREATED: 'commented on a post',
  USER_FOLLOWED: 'started following you',
  FRIEND_ACCEPTED: 'is now your friend',
  GROUP_JOINED: 'joined a group',
  EVENT_CREATED: 'created an event',
  EVENT_RSVP: 'RSVP\'d to an event',
  BADGE_EARNED: 'earned a badge',
  JOB_POSTED: 'posted a job',
  PRODUCT_LISTED: 'listed a product',
};

export const FeedItemCard = memo(function FeedItemCard({ item }: { item: FeedItem }) {
  const actorName = item.actor?.name ?? 'Someone';
  const actorUsername = item.actor?.username;
  const icon = TYPE_ICONS[item.type] ?? '🔔';
  const message = TYPE_MESSAGES[item.type] ?? 'did something';
  const preview = (item.metadata as Record<string, string> | undefined)?.preview;
  const timeAgo = formatTimeAgo(item.createdAt);

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/20 transition-colors">
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            href={`/profile/${actorUsername ?? item.actorId}`}
            className="font-semibold text-[var(--color-foreground)] text-sm hover:text-[var(--color-accent)] transition-colors truncate max-w-[160px]"
          >
            {actorName}
          </Link>
          <span className="text-[var(--color-foreground-muted)] text-sm">{message}</span>
          <span className="text-[var(--color-muted)] text-xs">· {timeAgo}</span>
        </div>
        {preview && (
          <p className="mt-1.5 text-sm text-[var(--color-foreground-muted)] line-clamp-2">
            {preview}
          </p>
        )}
      </div>
    </div>
  );
});

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
