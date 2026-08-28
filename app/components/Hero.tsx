'use client';

import { useEffect, useRef } from 'react';
import { useInView, useAnimate, useScroll, useTransform, useReducedMotion, motion } from 'framer-motion';
import { LazyMotion } from '@/lib/framer/lazy-motion';
import Image from 'next/image';
import NeonButton from './NeonButton';
import EmailCapture from './EmailCapture';
import Magnetic from './ui/Magnetic';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { EASE_APPLE, maskedLine, springPop, staggerContainer } from '@/lib/motion/variants';

function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true, margin: '-100px' });
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, end, {
      duration: 1.5,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate(latest) {
        if (displayRef.current) {
          displayRef.current.textContent = Math.floor(latest).toLocaleString();
        }
      },
    });
    return () => controls.stop();
  }, [inView, end, animate]);

  return (
    <span ref={scope} className="font-display tabular-nums">
      {prefix}
      <span ref={displayRef}>{end.toLocaleString()}</span>
      {suffix}
    </span>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const stats: { value: number; suffix?: string; prefix?: string; label: string }[] = [
    { value: 2400, suffix: '+', label: 'operators in the alliance' },
    { value: 120, suffix: '+', label: 'verified free-forever tools' },
    { value: 0, prefix: '$', label: 'subscription rent to start' },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left: Content */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-3/5 px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-0">
        <LazyMotion
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Eyebrow — badge style */}
          <LazyMotion
            as="span"
            variants={item}
            className="inline-block font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-accent border border-accent/30 rounded-full px-3 py-1.5 mb-6 w-fit"
          >
            {t.hero.eyebrow}
          </LazyMotion>

          {/* Headline — masked per-line reveal */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] mb-6 uppercase">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <LazyMotion as="span" variants={maskedLine} className="block">
                {t.hero.line1}
              </LazyMotion>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <LazyMotion as="span" variants={maskedLine} className="block text-accent">
                {t.hero.line2}
              </LazyMotion>
            </span>
          </h1>

          {/* Subheadline */}
          <LazyMotion
            as="p"
            variants={item}
            className="text-base sm:text-lg text-zinc-300 max-w-lg mb-10 font-body leading-relaxed"
          >
            {t.hero.subheadline}
          </LazyMotion>

          {/* CTAs */}
          <LazyMotion
            variants={item}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Magnetic strength={0.2}>
                <NeonButton variant="primary" href="/signup" className="text-base !py-4 !px-10 min-h-[48px]">
                  {t.hero.cta1}
                </NeonButton>
              </Magnetic>
              <NeonButton variant="secondary" pulse={false} href="/preview/fundraising-101" className="text-base !py-4 !px-10 min-h-[48px]">
                {t.hero.cta2}
              </NeonButton>
            </div>
            {/* Microcopy */}
            <p className="text-sm text-zinc-400 mt-1">
              {t.hero.microcopy}
            </p>
          </LazyMotion>

          {/* Email capture — low-friction lead gen */}
          <LazyMotion
            variants={item}
            className="mt-6"
          >
            <EmailCapture />
          </LazyMotion>
        </LazyMotion>

        {/* Stats row — consolidated inline, staggered spring pops */}
        <LazyMotion
          variants={staggerContainer(0.15, 1)}
          initial="hidden"
          animate="show"
          className="mt-16 lg:mt-20"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base sm:text-lg text-zinc-300 font-body">
            {stats.map((stat, i) => (
              <LazyMotion as="span" variants={springPop} key={stat.label} className="inline-flex items-baseline gap-1">
                <span className="font-display text-xl sm:text-2xl text-foreground tabular-nums leading-none">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix ?? ''} prefix={stat.prefix ?? ''} />
                </span>
                <span className="text-zinc-300">
                  {stat.label}
                </span>
                {i < stats.length - 1 && (
                  <span className="text-zinc-600 mx-2 select-none">·</span>
                )}
              </LazyMotion>
            ))}
          </div>

          {/* Outcome-driven testimonial placeholder */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <blockquote className="flex items-start gap-3">
              <svg className="w-6 h-6 shrink-0 mt-0.5 text-accent/40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
              </svg>
              <div>
                <p className="text-sm sm:text-base text-zinc-300 italic leading-relaxed">
                  &ldquo;{t.hero.testimonialQuote}&rdquo;
                </p>
                <p className="text-xs text-zinc-400 mt-1 font-mono uppercase tracking-wide">
                  — {t.hero.testimonialName}, {t.hero.testimonialCompany}
                </p>
              </div>
            </blockquote>
          </div>
        </LazyMotion>
      </div>

      {/* Right: Full-bleed photography — scroll parallax + settle-on-load */}
      <div className="relative w-full lg:w-2/5 h-48 sm:h-64 lg:h-auto lg:min-h-screen overflow-hidden">
        {/* B&W Photo */}
        <motion.div
          className="absolute inset-0"
          style={{ y: reduceMotion ? 0 : photoY }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE_APPLE }}
        >
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=1600&fit=crop&crop=faces"
            alt={t.hero.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            style={{ filter: 'grayscale(100%) contrast(1.3) brightness(0.8)' }}
          />
        </motion.div>
        {/* Red overlay */}
        <div className="absolute inset-0 bg-accent/20 mix-blend-multiply" />
        {/* Gradient fade to black at bottom & left */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:bg-gradient-to-r lg:from-black lg:via-transparent lg:to-transparent" />

        {/* Decorative label */}
        <div className="absolute bottom-8 left-8 z-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground-dim">
            📸 Alliance Summit &rsquo;26
          </p>
        </div>
      </div>
    </section>
  );
}

