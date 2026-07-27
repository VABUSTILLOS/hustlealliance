'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  metadata: Record<string, any>;
  createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  COURSE_ENROLLED: '🚀',
  LESSON_COMPLETED: '✅',
  BADGE_EARNED: '🏅',
  CERTIFICATE_ISSUED: '🎓',
  COURSE_EXPIRING: '⏰',
  LIVE_CLASS_REMINDER: '📺',
  QUIZ_PASSED: '🧠',
  XP_MILESTONE: '⚡',
  CONTENT_UNLOCKED: '🔓',
};

const TYPE_LABELS: Record<string, string> = {
  COURSE_ENROLLED: 'Enrolled',
  LESSON_COMPLETED: 'Completed',
  BADGE_EARNED: 'Badge',
  CERTIFICATE_ISSUED: 'Certificate',
  COURSE_EXPIRING: 'Expiring',
  LIVE_CLASS_REMINDER: 'Live Class',
  QUIZ_PASSED: 'Quiz',
  XP_MILESTONE: 'XP',
  CONTENT_UNLOCKED: 'Unlocked',
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications?limit=20');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount ?? data.notifications?.filter((n: Notification) => !n.read).length ?? 0);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    }).catch(() => {});
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    }).catch(() => {});
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5 text-foreground-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-accent text-foreground rounded-full shadow-[0_0_8px_rgba(255,59,48,0.5)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-surface border border-surface-light rounded-2xl shadow-2xl z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-light">
            <h4 className="font-heading text-sm text-foreground uppercase">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-accent hover:text-accent-glow transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-foreground-dim">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-sm text-foreground-dim gap-2">
              <span className="text-2xl">🔔</span>
              <span>No notifications yet</span>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  className={clsx(
                    'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors',
                    n.read ? 'opacity-60 hover:bg-white/[0.02]' : 'bg-accent/5 hover:bg-accent/10'
                  )}
                >
                  <span className="text-lg mt-0.5 flex-shrink-0">
                    {TYPE_ICONS[n.type] || '📌'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading text-foreground-dim uppercase">
                        {TYPE_LABELS[n.type] || n.type}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-foreground truncate mt-0.5">{n.body}</p>
                    <p className="text-xs text-foreground-muted mt-1">{formatTime(n.createdAt)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
