'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import clsx from 'clsx';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { ReactQueryProvider } from '@/lib/hooks/queryClient';
import dynamic from 'next/dynamic';

const GamificationWidgetLazy = dynamic(
  () => import('@/app/components/GamificationWidget'),
  { ssr: false }
);

const GlobalAudioPlayerLazy = dynamic(
  () => import('@/app/components/ResourceViewer/GlobalAudioPlayer').then((m) => ({ default: m.GlobalAudioPlayer })),
  { ssr: false }
);

// ── Subtle page transition wrapper ──
// Pathname-based key is deferred to post-hydration to avoid SSR/client key mismatch
function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <motion.div
      key={hydrated ? pathname : undefined}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const { t } = useTranslation();

  const sidebarLinks = [
    { label: t.nav.dashboard, href: '/dashboard', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
    )},
    { label: t.nav.learning, href: '/learning', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
    )},
    { label: t.nav.community, href: '/community', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
    )},
    { label: t.nav.spaces, href: '/spaces', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
    )},
    { label: t.nav.leaderboard, href: '/leaderboard', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 6 9 6 9z"/><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 18 9 18 9z"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>
    )},
    { label: t.nav.journey, href: '/journey', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
    )},
    { label: t.nav.resources, href: '/resources', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
    )},
    { label: t.nav.habits, href: '/founder-survival', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
    )},
    { label: t.nav.planner, href: '/planner', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    )},
  ];

  const mobileLinks = [
    ...sidebarLinks,
    { label: 'Profile', href: user?.username ? `/member/${user.username}` : '/member/alexk', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-7 8-7s8 3 8 7" /></svg>
    )},
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <ReactQueryProvider>
      <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Desktop Sidebar ────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border-subtle)] flex-col z-40">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-6 py-6 border-b border-surface-light">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-display text-white text-sm">
            HA
          </div>
          <span className="font-heading font-bold text-foreground text-sm tracking-wide">
            Hustle Alliance
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(link.href)
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-foreground hover:bg-surface-light'
              )}
            >
              <span className={clsx(isActive(link.href) && 'drop-shadow-[0_0_6px_rgba(255,59,48,0.4)]')}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User + Sign Out */}
        <div className="px-6 py-5 border-t border-surface-light">
          <div className="flex items-center gap-3 group mb-3">
            <Image
              src={user?.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User'}
              alt={user?.name ?? 'User'}
              width={36}
              height={36}
              className="rounded-full border-2 border-white/10 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-heading font-bold text-sm truncate">{user?.name ?? 'Member'}</p>
              <p className="text-muted text-xs font-mono truncate">{user?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={() => useStore.getState().signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t.nav.signOut}
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────── */}
      <main className="lg:ml-64 pb-20 lg:pb-0">
        <PageTransition>
          {children}
        </PageTransition>
        {/* Floating gamification widget — lazy loaded */}
        <GamificationWidgetLazy />
        {/* Global audio player — persists across navigation */}
        <GlobalAudioPlayerLazy />
      </main>

      {/* ── Mobile Bottom Tab Bar ───────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-light z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={clsx(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors',
                  active ? 'text-accent' : 'text-muted'
                )}
              >
                <span className={clsx(active && 'drop-shadow-[0_0_6px_rgba(255,59,48,0.4)]')}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </ReactQueryProvider>
  );
}
