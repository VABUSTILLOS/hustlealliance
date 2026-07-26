'use client';

import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  result: string;
  path?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Nina Okonkwo',
    role: 'Founder & CEO',
    company: 'Tula Health',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Nina+Okonkwo&backgroundColor=7c3aed',
    quote: 'I was stuck in fundraising limbo for 8 months. The Fundraising 101 path gave me the exact term sheet checklist I needed. Closed our $1.2M pre-seed two weeks later.',
    result: 'Raised $1.2M in 2 weeks',
    path: 'Fundraising 101',
  },
  {
    id: 't2',
    name: 'Diego Ramírez',
    role: 'Cofounder & CTO',
    company: 'StackBridge',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Diego+Ramirez&backgroundColor=db2777',
    quote: 'I\'m an engineer, not a marketer. The Growth Marketing path broke down customer acquisition into systems I could actually follow. We hit 2,000 beta signups in our first month.',
    result: '2,000 beta users in 30 days',
    path: 'Growth Marketing',
  },
  {
    id: 't3',
    name: 'Aisha Patel',
    role: 'Solo Founder',
    company: 'WriteFlow',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Aisha+Patel&backgroundColor=0891b2',
    quote: 'Being a solo founder is lonely. Hustle Alliance gave me a community of people who actually get it. The SaaS Founders space alone saved me from three product mistakes.',
    result: 'Avoided 3 costly pivots',
  },
  {
    id: 't4',
    name: 'James Hawthorne',
    role: 'CEO',
    company: 'Pivot Analytics',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=James+Hawthorne&backgroundColor=ea580c',
    quote: 'I was skeptical about "online learning" for startups. But the Product-Led Growth path was more actionable than my $5,000 accelerator program. Redesigned our onboarding — activation jumped 34%.',
    result: 'Activation rate up 34%',
    path: 'Product-Led Growth',
  },
  {
    id: 't5',
    name: 'Keiko Tanaka',
    role: 'Founder',
    company: 'Meridian Ventures',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Keiko+Tanaka&backgroundColor=9333ea',
    quote: 'The community here is different. It\'s not about vanity metrics or "crushing it." Real founders sharing real struggles and real solutions. The peer feedback on my pitch deck was invaluable.',
    result: 'Won pitch competition',
  },
  {
    id: 't6',
    name: 'Omar Hassan',
    role: 'Technical Founder',
    company: 'GridSense',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Omar+Hassan&backgroundColor=059669',
    quote: 'I joined for the learning paths, I stayed for the accountability. The 7-day streak system got me building consistently for the first time in years. Shipped more in 30 days than the previous 6 months.',
    result: 'Shipped in 30 days vs 6 months',
    path: 'Community Streaks',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function WallOfLove() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[var(--color-violet)]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-magenta)]/8 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            Wall of Love
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--color-foreground)] uppercase leading-tight">
            Loved by founders
            <br />
            <span className="bg-gradient-to-r from-[var(--color-violet)] to-[var(--color-magenta)] bg-clip-text text-transparent">
              around the world
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--color-foreground-muted)] max-w-lg mx-auto">
            Real results from real founders who leveled up with Hustle Alliance.
          </p>
        </motion.div>

        {/* Testimonial grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {testimonials.map((tm) => (
            <motion.div
              key={tm.id}
              variants={item}
              className="group p-5 sm:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]
                hover:border-[var(--color-accent)]/20 hover:shadow-[0_0_30px_rgba(255,59,48,0.06)]
                transition-all duration-300 flex flex-col"
            >
              {/* Quote */}
              <div className="flex-1">
                <svg className="w-8 h-8 text-[var(--color-accent)]/30 mb-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
                <p className="text-[var(--color-foreground-muted)] text-sm leading-relaxed mb-4">
                  {tm.quote}
                </p>
              </div>

              {/* Result badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {tm.result}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
                <img
                  src={tm.avatar}
                  alt={tm.name}
                  className="w-10 h-10 rounded-full border-2 border-white/10 object-cover shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="font-heading font-bold text-[var(--color-foreground)] text-sm">
                    {tm.name}
                  </p>
                  <p className="text-[var(--color-foreground-dim)] text-xs truncate">
                    {tm.role}, {tm.company}
                  </p>
                </div>
                {tm.path && (
                  <span className="ml-auto shrink-0 px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-mono font-bold">
                    {tm.path}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
