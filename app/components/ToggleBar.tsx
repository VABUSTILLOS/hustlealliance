'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { useTheme } from '@/lib/theme/useTheme';

export default function ToggleBar() {
  const { locale, setLocale } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-[100] flex items-center gap-2">
      {/* Language toggle */}
      <button
        onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
        className="px-2.5 py-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 backdrop-blur-md text-xs font-mono font-bold text-[var(--color-foreground)]/70 hover:text-accent hover:border-accent/30 transition-all"
        aria-label="Toggle language"
      >
        {locale === 'en' ? 'EN' : 'ES'}
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 backdrop-blur-md text-[var(--color-foreground)]/60 hover:text-accent transition-all"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
}
