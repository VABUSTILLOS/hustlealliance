'use client';

import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import translations, { type Locale } from './translations';

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof translations.en;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
});

function getLocaleCookie(name = 'ha-locale'): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  const maxAge = 365 * 24 * 60 * 60; // 1 year
  document.cookie = `ha-locale=${locale};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Check localStorage first, then fall back to cookie
    const stored = localStorage.getItem('ha-locale');
    if (stored === 'es' || stored === 'en') {
      setLocaleState(stored);
      setLocaleCookie(stored);
    } else {
      const cookieLocale = getLocaleCookie();
      if (cookieLocale === 'es' || cookieLocale === 'en') setLocaleState(cookieLocale);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('ha-locale', l);
    setLocaleCookie(l);
    if (typeof document !== 'undefined') document.documentElement.lang = l;
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] as typeof translations.en }}>
      {children}
    </I18nContext.Provider>
  );
}
