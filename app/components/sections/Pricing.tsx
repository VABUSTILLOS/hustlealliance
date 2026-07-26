'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

// ── Tier definitions ────────────────────────────────────────────────────
const tiers = [
  {
    name: 'Starter',
    price: '19',
    period: '/mo',
    description: 'For solo founders getting their first customers.',
    features: [
      'Community access',
      'Resource library',
      'Monthly masterminds',
      'Personal landing page',
      'Basic analytics',
    ],
    cta: 'Get Started',
    variant: 'outline' as const,
  },
  {
    name: 'Builder',
    price: '49',
    period: '/mo',
    description: 'For founders ready to scale their venture.',
    features: [
      'Everything in Starter',
      'Custom domain & branding',
      'Priority support',
      'Weekly masterminds',
      'Advanced analytics',
      'Member directory listing',
      'Exclusive partner deals',
    ],
    cta: 'Join as Builder',
    variant: 'solid' as const,
    popular: true,
  },
  {
    name: 'Alliance',
    price: '99',
    period: '/mo',
    description: 'The ultimate membership for serious builders.',
    features: [
      'Everything in Builder',
      'Dedicated account manager',
      'Daily masterminds',
      'White-label website',
      'API access',
      'Co-marketing opps',
      'Early feature access',
      'VIP event invitations',
    ],
    cta: 'Go Alliance',
    variant: 'outline' as const,
  },
];

// ── Testimonial data ────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      'This community changed everything. I found my co-founder here within two weeks of joining.',
    name: 'Sarah K.',
    role: 'Founder @ Nexus AI',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
  },
  {
    quote:
      'The guides alone are worth 10x the membership. The pre-seed deck template got us our first check.',
    name: 'Devon M.',
    role: 'CTO @ Flux Studio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
  },
  {
    quote:
      'I went from zero to $10K MRR in six months. The peer accountability is unreal.',
    name: 'Marcus T.',
    role: 'Founder @ Droplet SaaS',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face',
  },
];

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
  return (
    <section className="relative py-24 lg:py-32 px-4 bg-black">
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
            Membership
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-none uppercase">
            Choose your tier
          </h2>
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
                    Popular
                  </div>
                )}

                {/* Tier name */}
                <h3 className="font-heading text-xl font-bold text-white mb-1">
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
                      tier.popular ? 'text-accent' : 'text-white'
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
                      <span className="text-muted font-body">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={clsx(
                    'w-full py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300',
                    tier.variant === 'solid'
                      ? 'bg-accent text-white hover:bg-accent-glow shadow-[0_0_30px_rgba(255,59,48,0.25)] hover:shadow-[0_0_50px_rgba(255,59,48,0.4)] hover:scale-[1.02]'
                      : 'border border-white/15 text-white hover:border-accent/50 hover:text-accent hover:bg-accent/5'
                  )}
                >
                  {tier.cta}
                </button>
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
            What founders say
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
                <p className="text-white/80 font-body text-sm leading-relaxed italic mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Stars */}
                <div className="mb-4">
                  <Stars />
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full border-2 border-white/10 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-white font-heading font-bold text-sm">
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
