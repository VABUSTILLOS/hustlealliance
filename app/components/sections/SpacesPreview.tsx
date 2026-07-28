'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { spaces } from '@/lib/data/spaces';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function SpacesPreview() {
  const { t } = useTranslation();
  const previewSpaces = spaces.slice(0, 4);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-16 lg:py-32 px-4 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/2 right-1/4 w-[450px] h-[450px] bg-[var(--color-violet)]/4 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            {t.spaces.homeTag}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-foreground)] uppercase leading-tight max-w-3xl mx-auto">
            {t.spaces.homeHeadline}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--color-foreground-muted)] max-w-xl mx-auto">
            {t.spaces.homeSubtitle}
          </p>
        </motion.div>

        {/* Spaces grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12"
        >
          {previewSpaces.map((space) => (
            <motion.div key={space.slug} variants={item}>
              <Link
                href={`/spaces/${space.slug}`}
                className="group block rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border-subtle)]
                  hover:border-[var(--color-accent)]/30 hover:shadow-[0_0_30px_rgba(255,59,48,0.08)]
                  transition-all duration-300 h-full"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={space.image}
                    alt={space.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
                  {/* Member count badge */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-mono">
                    {space.memberCount.toLocaleString()} {t.spaces.members}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-heading font-bold text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                    {space.name}
                  </h3>
                  <p className="text-[var(--color-foreground-dim)] text-xs mt-1.5 line-clamp-2">
                    {space.description}
                  </p>
                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {space.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-surface-light)] text-[var(--color-foreground-dim)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Link
            href="/spaces"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]
              text-[var(--color-foreground)] font-heading font-bold text-sm
              hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)] transition-all duration-300"
          >
            {t.spaces.homeCta}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
