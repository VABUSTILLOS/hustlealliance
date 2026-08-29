'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { formatRelativeTime } from '@/lib/utils/format-date';
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
  LESSON_COMPLETED: '📚',
  CERTIFICATE_ISSUED: '🎓',
  CHALLENGE_COMPLETED: '🏁',
};

export const FeedItemCard = memo(function FeedItemCard({ item }: { item: FeedItem }) {
  const { t, locale } = useTranslation();
  const actorName = item.actor?.name ?? t.community.someone;
  const actorUsername = item.actor?.username;
  const icon = TYPE_ICONS[item.type] ?? '🔔';
  const message = getTypeMessage(item.type, t);
  const preview = (item.metadata as Record<string, string> | undefined)?.preview;
  const metaTitle =
    (item.metadata as Record<string, string> | undefined)?.title ??
    (item.metadata as Record<string, string> | undefined)?.name;
  const timeAgo = formatRelativeTime(item.createdAt, { style: 'intl', locale });
  const displayedPreview =
    preview ?? (metaTitle && (item.type === 'LESSON_COMPLETED' || item.type === 'CERTIFICATE_ISSUED' || item.type === 'BADGE_EARNED' || item.type === 'CHALLENGE_COMPLETED') ? metaTitle : undefined);

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-white/5 hover:border-accent/20 transition-colors">
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {actorUsername ? (
            <Link
              href={`/profile/${actorUsername}`}
              className="font-semibold text-white text-sm hover:text-accent transition-colors truncate max-w-[160px]"
            >
              {actorName}
            </Link>
          ) : (
            <span className="font-semibold text-white text-sm truncate max-w-[160px]">
              {actorName}
            </span>
          )}
          <span className="text-foreground-muted text-sm">{message}</span>
          <span className="text-muted text-xs">· {timeAgo}</span>
        </div>
        {displayedPreview && (
          <p className="mt-1.5 text-sm text-foreground-muted line-clamp-2">
            {displayedPreview}
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
    case 'LESSON_COMPLETED':
      return t.community.feedItem_completedLesson;
    case 'CERTIFICATE_ISSUED':
      return t.community.feedItem_issuedCertificate;
    case 'CHALLENGE_COMPLETED':
      return t.community.feedItem_completedChallenge;
    default:
      return t.community.feedItemDidSomething;
  }
}
