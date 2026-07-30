'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
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

export const FeedItemCard = memo(function FeedItemCard({ item }: { item: FeedItem }) {
  const { t, locale } = useTranslation();
  const actorName = item.actor?.name ?? t.community.someone;
  const actorUsername = item.actor?.username;
  const icon = TYPE_ICONS[item.type] ?? '🔔';
  const message = getTypeMessage(item.type, t);
  const preview = (item.metadata as Record<string, string> | undefined)?.preview;
  const timeAgo = formatTimeAgo(item.createdAt, locale);

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

function getTypeMessage(type: string, t: ReturnType<typeof useTranslation>['t']): string {
  switch (type) {
    case 'POST_CREATED':
      return t.community.feedItem_sharedPost;
    case 'POST_LIKED':
      return t.community.feedItem_likedPost;
    case 'COMMENT_CREATED':
      return t.community.feedItem_commentedPost;
    case 'USER_FOLLOWED':
      return t.community.feedItem_startedFollowing;
    case 'FRIEND_ACCEPTED':
      return t.community.feedItem_isNowYourFriend;
    case 'GROUP_JOINED':
      return t.community.feedItem_joinedGroup;
    case 'EVENT_CREATED':
      return t.community.feedItem_createdEvent;
    case 'EVENT_RSVP':
      return t.community.feedItem_rsvpdEvent;
    case 'BADGE_EARNED':
      return t.community.feedItem_earnedBadge;
    case 'JOB_POSTED':
      return t.community.feedItem_postedJob;
    case 'PRODUCT_LISTED':
      return t.community.feedItem_listedProduct;
    default:
      return t.community.feedItemDidSomething;
  }
}

function formatTimeAgo(dateStr: string, locale: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (mins < 1) return formatter.format(0, 'second');
  if (mins < 60) return formatter.format(-mins, 'minute');

  const hours = Math.floor(mins / 60);
  if (hours < 24) return formatter.format(-hours, 'hour');

  const days = Math.floor(hours / 24);
  if (days < 7) return formatter.format(-days, 'day');

  return new Date(dateStr).toLocaleDateString(locale);
}
