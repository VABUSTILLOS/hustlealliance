'use client';

import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import NeonButton from './NeonButton';

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const spring = useSpring(0, { stiffness: 80, damping: 30 });
  const display = useTransform(spring, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    if (inView) spring.set(end);
  }, [inView, spring, end]);

  return (
    <span ref={ref} className="font-display text-4xl sm:text-5xl tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  { value: 2400, suffix: '+', label: 'Founders' },
  { value: 180, suffix: '+', label: 'Guides' },
  { value: 40, suffix: 'M+', label: 'Raised' },
];

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
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left: Content */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-3/5 px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-0">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <motion.p
            variants={item}
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-6"
          >
            The Founder&apos;s Collective
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-6 uppercase"
          >
            Stop hustling
            <br />
            <span className="text-accent">alone.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="text-muted text-lg sm:text-xl max-w-md mb-10 font-body leading-relaxed"
          >
            Join 2,400+ founders building together. Community, custom
            websites, and the playbooks that actually work.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4"
          >
            <NeonButton variant="primary" href="/login" className="text-base !py-4 !px-10 !text-base">
              Join the Alliance
            </NeonButton>
            <NeonButton variant="secondary" href="/spaces" className="text-base !py-4 !px-10">
              View Member Sites
            </NeonButton>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap gap-x-12 gap-y-6 mt-16 lg:mt-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-display text-4xl sm:text-5xl text-white tabular-nums leading-none">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-muted mt-2">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right: Full-bleed photography */}
      <div className="relative w-full lg:w-2/5 h-64 sm:h-80 lg:h-auto min-h-[50vh] lg:min-h-screen overflow-hidden">
        {/* B&W Photo */}
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=1600&fit=crop&crop=faces"
          alt="Founders collaborating"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'grayscale(100%) contrast(1.3) brightness(0.8)' }}
        />
        {/* Red overlay */}
        <div className="absolute inset-0 bg-accent/20 mix-blend-multiply" />
        {/* Gradient fade to black at bottom & left */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:bg-gradient-to-r lg:from-black lg:via-transparent lg:to-transparent" />

        {/* Decorative label */}
        <div className="absolute bottom-8 left-8 z-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            📸 Alliance Summit &rsquo;26
          </p>
        </div>
      </div>
    </section>
  );
}

