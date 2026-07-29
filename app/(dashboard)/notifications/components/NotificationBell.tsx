'use client';

import { useUnreadCount } from '@/app/(dashboard)/notifications/hooks/useNotifications';
import Link from 'next/link';

export function NotificationBell() {
  const { data: unreadCount } = useUnreadCount();

  return (
    <Link
      href="/notifications"
      className="relative p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-light transition-all duration-200"
      aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
      prefetch={true}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      {unreadCount ? (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-red-500 rounded-full leading-none">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
