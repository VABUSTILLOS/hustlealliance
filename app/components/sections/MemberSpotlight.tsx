'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';

const members = [
  {
    name: 'Marcus Chen',
    role: 'Founder & CEO',
    startup: 'Nexus AI',
    niche: 'SaaS',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Priya Patel',
    role: 'CTO & Co-Founder',
    startup: 'Lumina Health',
    niche: 'Health',
    tagColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'James Okafor',
    role: 'Founder',
    startup: 'Volt Finance',
    niche: 'Fintech',
    tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Elena Torres',
    role: 'Co-Founder',
    startup: 'Aether Climate',
    niche: 'Climate',
    tagColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Devon Wright',
    role: 'Founder & Designer',
    startup: 'Flux Studio',
    niche: 'Creator',
    tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Amara Obi',
    role: 'CEO',
    startup: 'Cipher Security',
    niche: 'AI',
    tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=faces',
  },
];

const MemberCard = ({
  name,
  role,
  startup,
  niche,
  tagColor,
  image,
  index,
}: (typeof members)[number] & { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group cursor-pointer"
  >
    <div className="relative bg-surface border border-surface-light rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-[0_20px_60px_rgba(255,59,48,0.1)]">
      {/* Portrait photo */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700"
          style={{
            filter: 'grayscale(100%) contrast(1.1)',
          }}
          loading="lazy"
        />
        {/* Red overlay on hover */}
        <div className="absolute inset-0 bg-accent/0 mix-blend-multiply transition-all duration-500 group-hover:bg-accent/25" />

        {/* Gradient fade to bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

        {/* Niche tag */}
        <div
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${tagColor}`}
        >
          {niche}
        </div>

        {/* Info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-heading text-lg font-bold text-white leading-tight">
            {name}
          </h3>
          <p className="font-body text-xs text-white/50 mt-0.5">{role}</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
            <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-accent">
                {startup.charAt(0)}
              </span>
            </div>
            <span className="font-mono text-[11px] text-white/60 tracking-wide">
              {startup}
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function MemberSpotlight() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 lg:py-32 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            {t.spotlight.tag}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none uppercase">
            {t.spotlight.line1}
            <br />
            {t.spotlight.line2}
          </h2>
        </motion.div>

        {/* Trading card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {members.map((member, i) => (
            <MemberCard key={member.name} {...member} index={i} />
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="#members"
            className="font-mono text-xs uppercase tracking-[0.15em] text-accent hover:text-accent-glow transition-colors inline-flex items-center gap-2"
          >
            {t.spotlight.viewAll}
            <span className="text-lg leading-none">&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
