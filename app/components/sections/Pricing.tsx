'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

// ── Star rating component ───────────────────────────────────────────────
function Stars() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-amber-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Checkmark icon ──────────────────────────────────────────────────────
function Checkmark() {
  return (
    <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Main component ──────────────────────────────────────────────────────
export default function Pricing() {
  const { t } = useTranslation();

  const tiers = [
    {
      name: t.pricing.starter.name,
      price: t.pricing.starter.price,
      period: t.pricing.starter.period,
      description: t.pricing.starter.desc,
      features: [...t.pricing.starter.features],
      cta: t.pricing.starter.cta,
      variant: 'outline' as const,
    },
    {
      name: t.pricing.builder.name,
      price: t.pricing.builder.price,
      period: t.pricing.builder.period,
      description: t.pricing.builder.desc,
      features: [...t.pricing.builder.features],
      cta: t.pricing.builder.cta,
      variant: 'solid' as const,
      popular: true,
    },
    {
      name: t.pricing.alliance.name,
      price: t.pricing.alliance.price,
      period: t.pricing.alliance.period,
      description: t.pricing.alliance.desc,
      features: [...t.pricing.alliance.features],
      cta: t.pricing.alliance.cta,
      variant: 'outline' as const,
    },
  ];

  const testimonials = [
    { quote: t.pricing.testimonials.t1.quote, name: t.pricing.testimonials.t1.name, role: t.pricing.testimonials.t1.role, avatar: '/images/avatars/priyap.jpg' },
    { quote: t.pricing.testimonials.t2.quote, name: t.pricing.testimonials.t2.name, role: t.pricing.testimonials.t2.role, avatar: '/images/avatars/marcuschen.jpg' },
    { quote: t.pricing.testimonials.t3.quote, name: t.pricing.testimonials.t3.name, role: t.pricing.testimonials.t3.role, avatar: '/images/avatars/devonm.jpg' },
  ];
  return (
    <section className="relative py-16 lg:py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            {t.pricing.tag}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none uppercase">
            {t.pricing.headline}
          </h2>
        </motion.div>

        {/* ── Urgency banner ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {t.pricing.urgency.tag}: {t.pricing.urgency.message}
          </span>
        </motion.div>

        {/* ── Tier cards ─────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start mb-28">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={clsx(tier.popular && 'md:-mt-6 md:mb-6')}
            >
              <div
                className={clsx(
                  'relative rounded-2xl p-8 border transition-all duration-500',
                  tier.popular
                    ? 'bg-surface border-accent/40 shadow-[0_0_60px_rgba(255,59,48,0.12)]'
                    : 'bg-surface border-surface-light hover:border-white/15'
                )}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-mono font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                    {t.pricing.popular}
                  </div>
                )}

                {/* Tier name */}
                <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                  {tier.name}
                </h3>
                <p className="text-muted font-body text-sm mb-8">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span
                    className={clsx(
                      'font-display text-5xl sm:text-6xl leading-none',
                      tier.popular ? 'text-accent' : 'text-foreground'
                    )}
                  >
                    ${tier.price}
                  </span>
                  <span className="text-muted font-body text-sm ml-1">
                    {tier.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Checkmark />
                      <span className="text-zinc-300 font-body">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="#pricing"
                  className={clsx(
                    'w-full py-3 min-h-[48px] rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 inline-block text-center',
                    tier.variant === 'solid'
                      ? 'bg-accent text-white hover:bg-accent-glow shadow-[0_0_30px_rgba(255,59,48,0.25)] hover:shadow-[0_0_50px_rgba(255,59,48,0.4)] hover:scale-[1.02]'
                      : 'border border-white/15 text-foreground hover:border-accent/50 hover:text-accent hover:bg-accent/5'
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Testimonials ───────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent text-center mb-4">
            {t.pricing.testimonials.tag}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="relative bg-surface border border-surface-light rounded-2xl p-6 border-l-[3px] border-l-accent"
              >
                {/* Quote */}
                <p className="text-foreground-muted font-body text-sm leading-relaxed italic mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Stars */}
                <div className="mb-4">
                  <Stars />
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white/10 object-cover"
                  />
                  <div>
                    <p className="text-foreground font-heading font-bold text-sm">
                      {t.name}
                    </p>
                    <p className="text-muted font-body text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.blockquote>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
