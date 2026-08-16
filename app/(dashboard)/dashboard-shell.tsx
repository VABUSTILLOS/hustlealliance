'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import clsx from 'clsx';
import { useStore } from '@/lib/store/useStore';
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import MobileBottomNav from '@/app/components/MobileBottomNav';
import dynamic from 'next/dynamic';

import { NotificationBell } from '@/app/(dashboard)/notifications/components/NotificationBell';

const GamificationWidgetLazy = dynamic(
  () => import('@/app/components/GamificationWidget'),
  { ssr: false }
);

const GlobalAudioPlayerLazy = dynamic(
  () => import('@/app/components/ResourceViewer/GlobalAudioPlayer').then((m) => ({ default: m.GlobalAudioPlayer })),
  { ssr: false }
);

const SearchModal = dynamic(
  () => import('@/app/(dashboard)/components/SearchModal').then((m) => ({ default: m.SearchModal })),
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
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    { label: t.nav.events, href: '/events', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
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
    { label: t.general.profile, href: user?.username ? `/member/${user.username}` : '/member/alexk', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-7 8-7s8 3 8 7" /></svg>
    )},
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Desktop Sidebar ────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border-subtle)] flex-col z-40">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-6 py-6 border-b border-surface-light">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-display text-white text-sm">
            HA
          </div>
          <span className="font-heading font-bold text-foreground text-sm tracking-wide">
            {t.general.hustleAlliance}
          </span>
        </Link>

        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="mx-3 my-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted hover:text-foreground hover:bg-surface-light transition-all duration-200 border border-dashed border-[var(--color-border-subtle)] hover:border-accent/30"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span className="flex-1 text-left">{t.general.search}</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--color-surface-light)] text-muted">{t.general.searchKbd}</kbd>
        </button>

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
              src={user?.avatar ?? DEFAULT_AVATAR}
              alt={user?.name ?? t.general.user}
              width={36}
              height={36}
              className="rounded-full border-2 border-white/10 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-heading font-bold text-sm truncate">{user?.name ?? t.general.member}</p>
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
      <main className="lg:ml-64 pb-20 lg:pb-0 relative">
        {/* Notification bell — fixed top-right */}
        <div className="absolute top-4 right-4 z-30">
          <NotificationBell />
        </div>
        <PageTransition>
          {children}
        </PageTransition>
        {/* Floating gamification widget — lazy loaded */}
        <GamificationWidgetLazy />
        {/* Global audio player — persists across navigation */}
        <GlobalAudioPlayerLazy />
      </main>

      {/* ── Mobile Bottom Tab Bar (swipeable) ── */}
      <MobileBottomNav items={mobileLinks} />

      {/* ── Global Search Modal ── */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
