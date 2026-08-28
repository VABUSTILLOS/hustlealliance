'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Image from 'next/image';
import type { AuthUser } from '@/lib/auth/user';
import MobileBottomNav from '@/app/components/MobileBottomNav';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function AdminShell({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const adminLinks = [
    {
      label: t.admin.nav.dashboard,
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      label: t.admin.nav.courses,
      href: '/admin/courses',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
      ),
    },
    {
      label: t.admin.nav.users,
      href: '/admin/users',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      label: t.admin.nav.enrollments,
      href: '/admin/enrollments',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: t.admin.nav.analytics,
      href: '/admin/analytics',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      label: 'Reports',
      href: '/admin/reports',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      ),
    },
    {
      label: 'Store',
      href: '/admin/store',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      label: 'Pages',
      href: '/admin/pages',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
    },
    {
      label: 'Email',
      href: '/admin/email',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      label: 'Challenges',
      href: '/admin/challenges',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      label: 'Broadcasts',
      href: '/admin/broadcasts',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l18-8-8 18-2-8z" />
        </svg>
      ),
    },
    {
      label: 'Onboarding',
      href: '/admin/onboarding',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
    },
    {
      label: 'AI Studio',
      href: '/admin/ai-studio',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border-subtle)] flex-col z-40">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 px-6 py-6 border-b border-surface-light">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-display text-white text-sm">
            HA
          </div>
          <div>
            <span className="font-heading font-bold text-foreground text-sm tracking-wide block">
              {t.admin.sidebar.brand}
            </span>
            <span className="text-muted text-[10px] uppercase tracking-wider">{t.admin.sidebar.adminPanel}</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {adminLinks.map((link) => (
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

        {/* Divider + Back to site */}
        <div className="px-6 py-4 border-t border-surface-light space-y-3">
          <div className="flex items-center gap-3">
            <Image
              src={user.avatar}
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full border-2 border-white/10 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-heading font-bold text-sm truncate">{user.name}</p>
              <p className="text-accent text-[10px] uppercase tracking-wider">Admin</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-light transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {t.admin.sidebar.backToSite}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pb-20 lg:pb-0">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile bottom nav (swipeable) */}
      <MobileBottomNav items={adminLinks} />
    </div>
  );
}
