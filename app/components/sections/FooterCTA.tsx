'use client';

import { motion } from 'framer-motion';
import NeonButton from '../NeonButton';
import { useTranslation } from '@/lib/i18n/useTranslation';

const socials = [
  {
    href: '#',
    label: 'Twitter',
    svg: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: '#',
    label: 'GitHub',
    svg: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    href: '#',
    label: 'LinkedIn',
    svg: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: '#',
    label: 'YouTube',
    svg: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function FooterCTA() {
  const { t } = useTranslation();

  const footerLinks = [
    { href: '#about', label: t.footer.about },
    { href: '#contact', label: t.footer.contact },
    { href: '#terms', label: t.footer.terms },
    { href: '#privacy', label: t.footer.privacy },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-deeper">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 50%, rgba(180,76,240,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,245,255,0.12) 0%, transparent 60%)',
              'radial-gradient(ellipse at 70% 80%, rgba(180,76,240,0.25) 0%, transparent 60%), radial-gradient(ellipse at 30% 30%, rgba(0,245,255,0.12) 0%, transparent 60%)',
              'radial-gradient(ellipse at 40% 10%, rgba(180,76,240,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(0,245,255,0.12) 0%, transparent 60%)',
              'radial-gradient(ellipse at 20% 50%, rgba(180,76,240,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,245,255,0.12) 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-foreground mb-8">
            {t.footer.headline}
          </h2>
          <NeonButton variant="primary" href="/login" className="text-lg !py-4 !px-10 animate-pulse-glow">
            {t.footer.cta}
            <svg className="w-5 h-5 ml-2 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
          </NeonButton>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent mb-10" />

        {/* Footer links & socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          {/* Links */}
          <nav className="flex items-center gap-6">
            {footerLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-foreground-muted hover:text-violet transition-colors duration-200 font-body"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socials.map(({ href, label, svg }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-foreground-dim hover:text-cyan transition-colors duration-200"
              >
                {svg}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <p className="text-center text-foreground-dim font-body text-xs mt-10">
          {t.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
        </p>
      </div>
    </footer>
  );
}
