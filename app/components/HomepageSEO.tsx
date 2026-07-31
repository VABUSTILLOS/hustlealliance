import { cookies } from 'next/headers';
import type { Locale } from '@/lib/i18n/translations';
import translations from '@/lib/i18n/translations';

export default async function HomepageSEO() {
  const cookieStore = await cookies();
  const locale: Locale = cookieStore.get('ha-locale')?.value === 'es' ? 'es' : 'en';
  const t = translations[locale];

  return (
    <section aria-label="Hustle Alliance overview" className="sr-only">
      <h1>{t.hero.line1} {t.hero.line2}</h1>
      <p>{t.hero.subheadline}</p>
      <ul>
        <li>2,400+ active founders</li>
        <li>180+ tactical playbooks</li>
        <li>$40M+ raised by members</li>
      </ul>
      <p>{t.hero.microcopy}</p>
      <p>
        Join a private community of founders. Get proven playbooks, your own founder website,
        and direct access to mentors who&apos;ve raised millions. Plans from $19/month.
      </p>
    </section>
  );
}
