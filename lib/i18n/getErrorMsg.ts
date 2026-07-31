import translations, { type Locale } from './translations';
import type { ReactNode } from 'react';

type ErrorKey = keyof typeof translations.en.general.error;

function getLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  // Check localStorage first (set by I18nProvider)
  const stored = localStorage.getItem('ha-locale');
  if (stored === 'es' || stored === 'en') return stored;
  // Fall back to cookie
  const match = document.cookie.match(/(?:^|; )ha-locale=([^;]*)/);
  if (match) {
    const val = decodeURIComponent(match[1]);
    if (val === 'es' || val === 'en') return val;
  }
  return 'en';
}

/**
 * Returns a translated error message for use in hooks and non-React code.
 * Prefer useTranslation() in components when possible.
 */
export function getErrorMsg(key: ErrorKey): string {
  const locale = getLocale();
  return translations[locale].general.error[key] ?? key;
}

/**
 * Simple template interpolation: "Hello {name}" + { name: "World" } => "Hello World"
 */
export function interpolateMsg(template: string, params: Record<string, string | ReactNode>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}
