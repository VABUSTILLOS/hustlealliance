'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

const socials = [
  {
    href: 'https://twitter.com/hustlealliance',
    label: 'Twitter',
    svg: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: 'https://github.com/hustlealliance',
    label: 'GitHub',
    svg: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    href: 'https://linkedin.com/company/hustlealliance',
    label: 'LinkedIn',
    svg: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: 'https://youtube.com/@hustlealliance',
    label: 'YouTube',
    svg: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t } = useTranslation();

  const navLinks = [
    { href: '/learning', label: t.nav.learning },
    { href: '/journey', label: t.nav.journey },
    { href: '/resources', label: t.nav.resources },
    { href: '/community', label: t.nav.community },
    { href: '/spaces', label: t.nav.spaces },
    { href: '/events', label: t.nav.events },
    { href: '/leaderboard', label: t.nav.leaderboard },
  ];

  return (
    <footer className="relative bg-black border-t border-[var(--color-border-subtle)]">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-violet)] bg-clip-text text-transparent">
                Hustle Alliance
              </span>
            </Link>
            <p className="mt-3 text-sm text-[var(--color-foreground-muted)] leading-relaxed max-w-xs">
              The operating system for founders. Community, playbooks, and tools to go from idea to paying customers.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 rounded-lg text-[var(--color-foreground-dim)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all duration-200"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-[0.15em] text-[var(--color-foreground)] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {navLinks.slice(0, 4).map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-[0.15em] text-[var(--color-foreground)] mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5">
              {navLinks.slice(4).map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="#pricing"
                  className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
                >
                  {t.hero.cta1}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-foreground-dim)]">
            {t.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-[var(--color-foreground-dim)] hover:text-[var(--color-foreground-muted)] transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="text-xs text-[var(--color-foreground-dim)] hover:text-[var(--color-foreground-muted)] transition-colors">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
