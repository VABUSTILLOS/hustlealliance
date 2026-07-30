'use client';

import { useNotifications, useMarkAsRead } from '@/app/(dashboard)/notifications/hooks/useNotifications';
import type { NotificationItem } from '@/app/(dashboard)/notifications/hooks/useNotifications';
import { NotificationItemRow } from './NotificationItem';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useNotifications(5);
  const markAsRead = useMarkAsRead();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications: NotificationItem[] =
    data?.pages.flatMap((p) => p.notifications).slice(0, 5) ?? [];

  const handleClick = useCallback(
    (n: NotificationItem) => {
      if (!n.read) {
        markAsRead.mutate(n.id);
      }
    },
    [markAsRead]
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl shadow-xl z-50 overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
        <h3 className="font-heading font-bold text-sm text-foreground">{t.notifications.title}</h3>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {isLoading ? (
          <div className="px-4 py-8 text-center text-muted text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted text-sm">
            {t.notifications.emptyState}
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationItemRow key={n.id} notification={n} onClick={handleClick} compact />
          ))
        )}
      </div>

      <Link
        href="/notifications"
        onClick={onClose}
        className="block px-4 py-3 text-center text-sm text-accent hover:bg-accent/5 border-t border-[var(--color-border-subtle)] font-medium transition-colors"
      >
        {t.notifications.viewAll}
      </Link>
    </div>
  );
}
