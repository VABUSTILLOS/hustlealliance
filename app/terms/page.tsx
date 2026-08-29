'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { interpolateMsg } from '@/lib/i18n/getErrorMsg';

export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-black text-foreground font-body">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <Link href="/" className="text-sm text-accent hover:text-accent-glow transition-colors mb-8 inline-block">
          {t.terms.backHome}
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase mb-8">{t.terms.title}</h1>
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-zinc-300 text-sm leading-relaxed">
            {interpolateMsg(t.terms.lastUpdated, { year: new Date().getFullYear() })}
          </p>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.terms.section1Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.terms.section1Body}
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.terms.section2Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.terms.section2Body}
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.terms.section3Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.terms.section3Body}
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.terms.section4Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.terms.section4Body}
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.terms.section5Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.terms.section5Body}
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">{t.terms.section6Title}</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t.terms.section6Body}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
