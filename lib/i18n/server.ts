import { cookies } from 'next/headers';
import translations, { type Locale } from './translations';

function normalizeLocale(value: string | null): Locale {
  return value === 'es' || value === 'en' ? value : 'en';
}

export async function getServerT() {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get('ha-locale')?.value ?? null);
  return { t: translations[locale] as typeof translations.en, locale };
}
