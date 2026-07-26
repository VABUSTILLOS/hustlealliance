'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useTheme } from '@/lib/theme/useTheme';
import { useStore } from '@/lib/store/useStore';
import { useCurrentUser, getFirstName } from '@/lib/hooks/useCurrentUser';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t, locale, setLocale } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const user = useCurrentUser();
  const router = useRouter();

  const links = [
    { href: '/dashboard', label: t.nav.dashboard },
    { href: '/learning', label: t.nav.learning },
    { href: '/journey', label: t.nav.journey },
    { href: '/resources', label: t.nav.resources },
    { href: '/founder-survival', label: t.nav.habits },
    { href: '/planner', label: t.nav.planner },
    { href: '/community', label: t.nav.community },
    { href: '/spaces', label: t.nav.spaces },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="gradient-text text-xl sm:text-2xl font-heading font-bold tracking-tight">
            Hustle Alliance
          </Link>

          {/* Desktop Links + Toggles */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="text-sm font-medium text-[var(--color-foreground)]/70 hover:text-accent transition-colors duration-200"
              >
                {label}
              </Link>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--color-foreground)]/60 hover:text-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
              className="px-2.5 py-1 rounded-lg border border-[var(--color-border-subtle)] text-xs font-mono font-bold text-[var(--color-foreground)]/70 hover:text-accent hover:border-accent/30 transition-all"
            >
              {locale === 'en' ? 'EN' : 'ES'}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-light/50 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-white/10 object-cover"
                  />
                  <span className="text-sm font-medium text-foreground hidden lg:block">
                    {getFirstName(user.name)}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-surface border border-surface-light rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-surface-light">
                        <p className="text-foreground font-heading font-bold text-sm truncate">{user.name}</p>
                        <p className="text-muted text-xs truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { useStore.getState().signOut(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted hover:text-red-400 hover:bg-red-400/5 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 bg-accent text-white font-heading font-bold text-sm rounded-xl hover:bg-accent-glow shadow-[0_0_20px_rgba(255,59,48,0.3)] transition-all"
              >
                {t.nav.joinAlliance}
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={t.nav.toggleMenu}
          >
            <motion.span
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-accent rounded"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-0.5 bg-accent rounded"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-accent rounded"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-[var(--color-bg)]/95 border-t border-[var(--color-border-subtle)]"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-[var(--color-foreground)]/70 hover:text-accent transition-colors duration-200 py-2"
                >
                  {label}
                </Link>
              ))}

              {/* Mobile toggles */}
              <div className="flex items-center gap-3 py-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-[var(--color-foreground)]/60 hover:text-accent transition-colors"
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                  )}
                  <span className="sr-only">Toggle theme</span>
                </button>
                <button
                  onClick={() => { setLocale(locale === 'en' ? 'es' : 'en'); setOpen(false); }}
                  className="px-3 py-1.5 rounded-lg border border-[var(--color-border-subtle)] text-xs font-mono font-bold text-[var(--color-foreground)]/70 hover:text-accent transition-all"
                >
                  {locale === 'en' ? '🇪🇸 Español' : '🇺🇸 English'}
                </button>
              </div>

              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-t border-surface-light mt-2 pt-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white/10 object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-heading font-bold text-sm truncate">{user.name}</p>
                      <p className="text-muted text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { useStore.getState().signOut(); setOpen(false); }}
                    className="block w-full text-center px-4 py-2 border border-foreground-dim/20 text-foreground/70 font-heading font-bold text-sm rounded-xl hover:border-red-400/30 hover:text-red-400 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-accent text-white font-heading font-bold text-sm rounded-xl hover:bg-accent-glow transition-all"
                >
                  {t.nav.joinAlliance}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
