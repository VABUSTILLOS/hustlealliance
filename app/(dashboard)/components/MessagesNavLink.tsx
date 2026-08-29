'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

// Sidebar messages link with a live unread-count badge.
export function MessagesNavLink() {
  const pathname = usePathname();
  const user = useCurrentUser();
  const { t } = useTranslation();

  const { data } = useQuery<{ count: number }>({
    queryKey: ['messages-unread-count'],
    queryFn: async () => {
      const res = await fetch('/api/messages/unread-count');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: !!user,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const count = data?.count ?? 0;
  const active = pathname === '/messages' || pathname.startsWith('/messages/');

  return (
    <Link
      href="/messages"
      prefetch={true}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
        active
          ? 'bg-accent/10 text-accent'
          : 'text-muted hover:text-foreground hover:bg-surface-light',
      )}
    >
      <span className={clsx(active && 'drop-shadow-[0_0_6px_rgba(255,59,48,0.4)]')}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </span>
      {t.messages.messagesTitle}
      {count > 0 && (
        <span className="ml-auto bg-accent text-white text-[10px] font-mono font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
