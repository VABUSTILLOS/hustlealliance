'use client';

import { useNotifications, useMarkAllRead } from './hooks/useNotifications';
import { NotificationList } from './components/NotificationList';
import { NotificationSettings } from './components/NotificationSettings';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'all' | 'settings'>('all');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotifications(20);
  const markAllRead = useMarkAllRead();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const allNotifications =
    data?.pages.flatMap((p) => p.notifications) ?? [];

  // Scroll-based infinite loading
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border-subtle)]">
        <button
          onClick={() => setTab('all')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'all'
              ? 'bg-accent/10 text-accent'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {t.notifications.tabAllNotifications}
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'settings'
              ? 'bg-accent/10 text-accent'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {t.notifications.tabSettings}
        </button>
      </div>

      {/* Content */}
      {tab === 'all' ? (
        <>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-surface-light rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <NotificationList
                notifications={allNotifications}
                onMarkAllRead={() => markAllRead.mutate()}
              />

              {/* Load more trigger */}
              {hasNextPage && (
                <div ref={loadMoreRef} className="py-8 text-center">
                  {isFetchingNextPage ? (
                    <div className="inline-block w-5 h-5 border-2 border-muted border-t-accent rounded-full animate-spin" />
                  ) : (
                    <span className="text-sm text-muted">{t.notifications.loadMore}</span>
                  )}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <NotificationSettings />
      )}
    </div>
  );
}
