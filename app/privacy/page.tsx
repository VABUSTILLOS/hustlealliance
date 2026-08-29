'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { interpolateMsg } from '@/lib/i18n/getErrorMsg';

export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-black text-foreground font-body">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <Link href="/" className="text-sm text-accent hover:text-accent-glow transition-colors mb-8 inline-block">
          {t.privacy.backHome}
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase mb-8">{t.privacy.title}</h1>
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-zinc-300 text-sm leading-relaxed">
            {interpolateMsg(t.privacy.lastUpdated, { year: new Date().getFullYear() })}
          </p>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.privacy.section1Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.privacy.section1Body}
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.privacy.section2Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.privacy.section2Body}
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.privacy.section3Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.privacy.section3Body}
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.privacy.section4Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.privacy.section4Body}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
