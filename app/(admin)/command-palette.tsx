'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

type PaletteItem = {
  label: string;
  href: string;
  group: 'Page' | 'Action';
  keywords?: string;
};

const ITEMS: PaletteItem[] = [
  { label: 'Dashboard', href: '/admin', group: 'Page', keywords: 'home kpis' },
  { label: 'Analytics', href: '/admin/analytics', group: 'Page' },
  { label: 'Reports', href: '/admin/reports', group: 'Page' },
  { label: 'Courses', href: '/admin/courses', group: 'Page' },
  { label: 'Users', href: '/admin/users', group: 'Page', keywords: 'members contacts' },
  { label: 'Enrollments', href: '/admin/enrollments', group: 'Page' },
  { label: 'Store', href: '/admin/store', group: 'Page', keywords: 'products orders coupons' },
  { label: 'Affiliates', href: '/admin/store/affiliates', group: 'Page', keywords: 'referrals payouts commissions' },
  { label: 'Pages', href: '/admin/pages', group: 'Page', keywords: 'landing builder funnels' },
  { label: 'Global Layout', href: '/admin/pages/global-layout', group: 'Page', keywords: 'header footer' },
  { label: 'Email', href: '/admin/email', group: 'Page', keywords: 'campaigns automations broadcasts' },
  { label: 'Challenges', href: '/admin/challenges', group: 'Page' },
  { label: 'Broadcasts', href: '/admin/broadcasts', group: 'Page' },
  { label: 'Onboarding', href: '/admin/onboarding', group: 'Page' },
  { label: 'AI Studio', href: '/admin/ai-studio', group: 'Page', keywords: 'generate chat copy' },
  { label: 'Activity Log', href: '/admin/activity', group: 'Page', keywords: 'audit history' },
  { label: 'Settings', href: '/admin/settings', group: 'Page', keywords: 'seo social maintenance' },
  { label: 'New product', href: '/admin/store?new=1', group: 'Action' },
  { label: 'New landing page', href: '/admin/pages?new=1', group: 'Action' },
  { label: 'New campaign', href: '/admin/email?new=campaign', group: 'Action' },
  { label: 'New automation', href: '/admin/email?new=automation', group: 'Action' },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setIndex(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? ITEMS.filter((i) => i.label.toLowerCase().includes(q) || i.keywords?.includes(q))
    : ITEMS;

  const go = (item: PaletteItem) => {
    close();
    router.push(item.href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
      onClick={close}
    >
      <div
        className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, filtered.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
            else if (e.key === 'Enter' && filtered[index]) { e.preventDefault(); go(filtered[index]); }
          }}
          placeholder="Jump to a page or action…"
          className="w-full px-5 py-4 bg-transparent text-foreground text-sm outline-none border-b border-[var(--color-border-subtle)]"
        />
        <ul className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-5 py-3 text-sm text-muted">No matches</li>
          )}
          {filtered.map((item, i) => (
            <li key={item.label}>
              <button
                onClick={() => go(item)}
                onMouseEnter={() => setIndex(i)}
                className={clsx(
                  'w-full flex items-center justify-between px-5 py-2.5 text-sm text-left transition-colors',
                  i === index ? 'bg-accent/10 text-accent' : 'text-foreground'
                )}
              >
                <span>{item.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted">{item.group}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="px-5 py-2 border-t border-[var(--color-border-subtle)] text-[10px] text-muted flex gap-4">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
