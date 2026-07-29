'use client';

import type { NotificationItem } from '@/app/(dashboard)/notifications/hooks/useNotifications';
import { NotificationItemRow } from './NotificationItem';
import { groupByDate } from '@/lib/utils/date';
import { useMarkAsRead, useDeleteNotification } from '@/app/(dashboard)/notifications/hooks/useNotifications';

interface NotificationListProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

const GROUP_LABELS: Record<string, string> = {
  Today: 'Today',
  Yesterday: 'Yesterday',
  'This Week': 'This Week',
  Older: 'Older',
};

export function NotificationList({ notifications, onMarkAllRead }: NotificationListProps) {
  const markAsRead = useMarkAsRead();
  const deleteNotification = useDeleteNotification();

  // Group notifications
  const grouped: Record<string, NotificationItem[]> = {};
  for (const n of notifications) {
    const group = groupByDate(n.createdAt);
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(n);
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>
        <h3 className="text-foreground font-heading font-bold text-lg mb-1">No notifications yet</h3>
        <p className="text-muted text-sm">When you get notifications, they&apos;ll show up here.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with mark all read */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-heading font-bold text-lg">Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Grouped list */}
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group} className="mb-6">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">
            {GROUP_LABELS[group] ?? group}
          </h3>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
            {items.map((n, i) => (
              <div
                key={n.id}
                className={i < items.length - 1 ? 'border-b border-[var(--color-border-subtle)]' : ''}
              >
                <NotificationItemRow
                  notification={n}
                  onClick={(notification) => {
                    if (!notification.read) markAsRead.mutate(notification.id);
                  }}
                />
                <div className="px-4 pb-2 flex justify-end">
                  <button
                    onClick={() => deleteNotification.mutate(n.id)}
                    className="text-[11px] text-muted hover:text-red-400 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
