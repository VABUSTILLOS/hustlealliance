'use client';

import { useEffect, useRef } from 'react';
import { useUnreadCount } from '@/app/(dashboard)/notifications/hooks/useNotifications';
import { useToast } from '@/app/(dashboard)/components/Toast';
import type { NotificationItem } from '@/app/(dashboard)/notifications/hooks/useNotifications';

/**
 * Polls for new notifications and shows toasts when new ones arrive.
 * Uses polling (refetch) as a fallback for real-time subscriptions.
 */
export function useNotificationStream() {
  const { data: unreadCount, dataUpdatedAt } = useUnreadCount();
  const prevCountRef = useRef<number | undefined>(undefined);
  const lastDataAtRef = useRef<number>(0);
  const { addToast } = useToast();

  useEffect(() => {
    if (unreadCount === undefined) return;

    const prev = prevCountRef.current;
    prevCountRef.current = unreadCount;

    // Only fire when count increases and the data actually refreshed
    if (prev !== undefined && unreadCount > prev && dataUpdatedAt > lastDataAtRef.current) {
      // Fetch the latest notification to get its details for the toast
      fetch('/api/notifications?limit=1')
        .then((res) => res.json())
        .then((data: { notifications: NotificationItem[] }) => {
          const latest = data.notifications?.[0];
          if (latest) {
            const link = getToastLink(latest);
            addToast({
              title: latest.title,
              body: latest.body,
              avatar: latest.actor?.avatar ?? undefined,
              link,
            });
          }
        })
        .catch(() => {
          // Silently fail — toast is optional
        });
    }

    lastDataAtRef.current = dataUpdatedAt;
  }, [unreadCount, dataUpdatedAt, addToast]);
}

function getToastLink(notification: NotificationItem): string | undefined {
  const type = notification.type;
  const sourceId = notification.sourceId;
  const meta = notification.metadata as Record<string, unknown> | null;

  if (!sourceId) return undefined;

  switch (type) {
    case 'FOLLOWED':
    case 'FRIEND_REQUEST':
    case 'FRIEND_ACCEPTED': {
      const username = meta?.username || meta?.followerUsername || sourceId;
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
    case 'NEW_MESSAGE':
      return `/messages/${sourceId}`;
    default:
      return '/notifications';
  }
}
