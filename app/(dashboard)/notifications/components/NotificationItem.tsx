'use client';

import type { NotificationItem } from '@/app/(dashboard)/notifications/hooks/useNotifications';
import Image from 'next/image';
import clsx from 'clsx';
import { formatRelativeTime } from '@/lib/utils/date';

function getNotificationIcon(type: string): React.ReactNode {
  switch (type) {
    case 'FOLLOWED':
      return (
        <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
      );
    case 'POST_LIKED':
    case 'COMMENT_LIKED':
      return (
        <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
      );
    case 'COMMENTED':
    case 'MENTIONED':
      return (
        <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
      );
    case 'FRIEND_REQUEST':
    case 'FRIEND_ACCEPTED':
      return (
        <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
      );
    case 'GROUP_INVITE':
    case 'GROUP_JOIN_REQUEST':
    case 'GROUP_POST':
      return (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
      );
    case 'EVENT_INVITE':
    case 'EVENT_REMINDER':
      return (
        <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
      );
    case 'NEW_MESSAGE':
      return (
        <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
      );
  }
}

function getEntityLink(type: string, sourceId: string | null, metadata: Record<string, unknown> | null): string | null {
  if (!sourceId) return null;
  switch (type) {
    case 'FOLLOWED':
    case 'FRIEND_REQUEST':
    case 'FRIEND_ACCEPTED': {
      const username = metadata?.username || metadata?.followerUsername || sourceId;
      return `/member/${username}`;
    }
    case 'POST_LIKED':
    case 'COMMENT_LIKED':
    case 'COMMENTED':
    case 'MENTIONED':
      return `/community?post=${sourceId}`;
    case 'GROUP_INVITE':
    case 'GROUP_JOIN_REQUEST':
    case 'GROUP_POST':
      return `/spaces/${sourceId}`;
    case 'EVENT_INVITE':
    case 'EVENT_REMINDER':
      return `/events/${sourceId}`;
    case 'NEW_MESSAGE':
      return `/messages/${sourceId}`;
    default:
      return null;
  }
}

interface NotificationItemRowProps {
  notification: NotificationItem;
  onClick?: (n: NotificationItem) => void;
  compact?: boolean;
}

export function NotificationItemRow({ notification: n, onClick, compact }: NotificationItemRowProps) {
  const link = getEntityLink(n.type, n.sourceId, n.metadata);

  const content = (
    <div
      className={clsx(
        'flex items-start gap-3 transition-colors cursor-pointer',
        compact ? 'px-4 py-3' : 'px-4 py-3',
        !n.read && 'bg-accent/5',
        'hover:bg-surface-light'
      )}
      onClick={() => onClick?.(n)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {n.actor?.avatar ? (
          <Image
            src={n.actor.avatar}
            alt={n.actor.name}
            width={32}
            height={32}
            className="rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center border border-white/10">
            {getNotificationIcon(n.type)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {/* Type icon for non-compact */}
          {!compact && getNotificationIcon(n.type)}
          <p className={clsx('text-sm leading-snug', n.read ? 'text-muted' : 'text-foreground font-medium')}>
            {n.body}
          </p>
          {!n.read && (
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent" />
          )}
        </div>
        {!compact && typeof n.metadata?.preview === 'string' && (
          <p className="mt-1 text-xs text-muted truncate">
            {(n.metadata!.preview as string).slice(0, 80)}
          </p>
        )}
        <p className="mt-0.5 text-[11px] text-muted">
          {formatRelativeTime(n.createdAt)}
        </p>
      </div>
    </div>
  );

  if (link && onClick) {
    return content; // already has onClick for navigation
  }

  return (
    <div className={clsx('border-b border-[var(--color-border-subtle)] last:border-b-0')}>
      {content}
    </div>
  );
}
