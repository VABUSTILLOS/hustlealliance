'use client';

import { useEffect, useRef } from 'react';
import { useInView, useAnimate } from 'framer-motion';
import { LazyMotion } from '@/lib/framer/lazy-motion';
import Image from 'next/image';
import NeonButton from './NeonButton';
import { useTranslation } from '@/lib/i18n/useTranslation';

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
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
    <span ref={scope} className="font-display text-4xl sm:text-5xl tabular-nums">
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

  const stats = [
    { value: 2400, suffix: '+', label: t.hero.founders },
    { value: 180, suffix: '+', label: t.hero.guides },
    { value: 40, suffix: 'M+', label: t.hero.raised },
  ]; return (
    <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left: Content */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-3/5 px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-0">
        <LazyMotion
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <LazyMotion
            as="p"
            variants={item}
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-6"
          >
            {t.hero.eyebrow}
          </LazyMotion>

          {/* Headline */}
          <LazyMotion
            as="h1"
            variants={item}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] mb-6 uppercase"
          >
            {t.hero.line1}
            <br />
            <span className="text-accent">{t.hero.line2}</span>
          </LazyMotion>

          {/* Subheadline */}
          <LazyMotion
            as="p"
            variants={item}
            className="text-muted text-lg sm:text-xl max-w-md mb-10 font-body leading-relaxed"
          >
            {t.hero.subheadline}
          </LazyMotion>

          {/* CTAs */}
          <LazyMotion
            variants={item}
            className="flex flex-col sm:flex-row gap-4"
          >
            <NeonButton variant="primary" href="/dashboard" className="text-base !py-4 !px-10 !text-base">
              {t.hero.cta1}
            </NeonButton>
            <NeonButton variant="secondary" href="/spaces" className="text-base !py-4 !px-10">
              {t.hero.cta2}
            </NeonButton>
          </LazyMotion>
        </LazyMotion>

        {/* Stats row */}
        <LazyMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap gap-x-12 gap-y-6 mt-16 lg:mt-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-display text-4xl sm:text-5xl text-foreground tabular-nums leading-none">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-muted mt-2">
                {stat.label}
              </span>
            </div>
          ))}
        </LazyMotion>
      </div>

      {/* Right: Full-bleed photography */}
      <div className="relative w-full lg:w-2/5 h-64 sm:h-80 lg:h-auto min-h-[50vh] lg:min-h-screen overflow-hidden">
        {/* B&W Photo */}
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=1600&fit=crop&crop=faces"
          alt={t.hero.imageAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
          style={{ filter: 'grayscale(100%) contrast(1.3) brightness(0.8)' }}
        />
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

