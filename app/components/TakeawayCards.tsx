'use client';

import { motion } from 'framer-motion';

interface Takeaway {
  id: string;
  author: string;
  handle: string;
  role: string;
  session: string;
  excerpt: string;
  tags: string[];
  likes: number;
  replies: number;
  timestamp: string;
}

const takeaways: Takeaway[] = [
  {
    id: '1',
    author: 'Marcus Chen',
    handle: '@marchen',
    role: 'CEO, Nexus AI',
    session: 'Mastermind: Fundraising',
    excerpt:
      'Never send a PDF deck. Use DocSend to track exactly how long investors spend on each slide. When I saw a partner spent 4 minutes on my traction slide, I knew exactly what to emphasize in the meeting.',
    tags: ['Fundraising', 'Tactical'],
    likes: 247,
    replies: 53,
    timestamp: 'Yesterday',
  },
  {
    id: '2',
    author: 'Priya Patel',
    handle: '@priyap',
    role: 'CTO, Lumina Health',
    session: 'Mastermind: Growth',
    excerpt:
      'Here\'s the cold email subject line that got us 42% open rate: "Quick question about [competitor name]" — it triggers curiosity and signals you\'ve done your research. We booked 17 demos in one week.',
    tags: ['Growth', 'Outbound'],
    likes: 189,
    replies: 41,
    timestamp: '2 days ago',
  },
  {
    id: '3',
    author: 'James Okafor',
    handle: '@jokafor',
    role: 'Founder, Volt Finance',
    session: 'Mastermind: Product',
    excerpt:
      'Stop building features nobody asked for. We ran the PMF survey from Module 3 and discovered our "killer feature" was actually the #4 thing users cared about. Cut 6 months of wasted dev time.',
    tags: ['Product', 'Validation'],
    likes: 312,
    replies: 78,
    timestamp: '3 days ago',
  },
  {
    id: '4',
    author: 'Elena Torres',
    handle: '@elenat',
    role: 'Co-Founder, Aether Climate',
    session: 'Mastermind: Legal',
    excerpt:
      'The term sheet clause that saved us $120K: "most favored nation" on liquidation preferences. Our lawyer missed it but a community member flagged it. That one catch just paid for 10 years of membership.',
    tags: ['Legal', 'Fundraising'],
    likes: 421,
    replies: 95,
    timestamp: '4 days ago',
  },
  {
    id: '5',
    author: 'Sarah Kim',
    handle: '@sarahk',
    role: 'Founder, GrowthOS',
    session: 'Mastermind: Pricing',
    excerpt:
      'Raise your prices. We moved from $29/mo to $49/mo and conversions actually went UP. The community taught me that higher prices signal confidence. Our MRR jumped 40% in 60 days.',
    tags: ['Pricing', 'SaaS'],
    likes: 278,
    replies: 62,
    timestamp: '5 days ago',
  },
  {
    id: '6',
    author: 'Diego Ramirez',
    handle: '@diegor',
    role: 'Founder, Voxel Studios',
    session: 'Mastermind: Launch Strategy',
    excerpt:
      'Don\'t launch on Product Hunt on Tuesday. Our data across 50+ launches shows Wednesday at 12:01 AM PST gets 3x the upvotes. The algorithm favors early momentum, and you get a full 24-hour window.',
    tags: ['Launch', 'Growth'],
    likes: 156,
    replies: 34,
    timestamp: '6 days ago',
  },
];

const tagColors: Record<string, string> = {
  Fundraising: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20',
  Tactical: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Growth: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Outbound: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Product: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Validation: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  Legal: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Pricing: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  SaaS: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Launch: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

export default function TakeawayCards() {
  return (
    <section className="relative py-24 lg:py-32 px-4 bg-[var(--color-bg)]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[var(--color-accent)]/3 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">
            🔥 Inside the Alliance
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[var(--color-foreground)] leading-none uppercase">
            Mastermind
            <br />
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-glow)] bg-clip-text text-transparent">
              Takeaways
            </span>
          </h2>
          <p className="mt-4 text-[var(--color-foreground-muted)] max-w-lg mx-auto text-sm sm:text-base">
            Real conversations. Real tactics. These are the kinds of insights dropped daily in our mastermind sessions.
          </p>
        </motion.div>

        {/* Takeaway cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {takeaways.map((takeaway, i) => (
            <motion.div
              key={takeaway.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <article className="group h-full p-5 sm:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/20 hover:shadow-[0_0_40px_rgba(255,59,48,0.06)] transition-all duration-300">
                {/* Author header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-accent-glow)]/20 flex items-center justify-center shrink-0 border border-[var(--color-accent)]/20">
                    <span className="font-mono text-xs font-bold text-[var(--color-accent)]">
                      {takeaway.author.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm font-bold text-[var(--color-foreground)] truncate">
                        {takeaway.author}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--color-foreground-dim)] shrink-0">
                        {takeaway.handle}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-foreground-dim)]">{takeaway.role}</p>
                  </div>
                  <span className="ml-auto font-mono text-[10px] text-[var(--color-foreground-dim)] shrink-0">
                    {takeaway.timestamp}
                  </span>
                </div>

                {/* Session badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 mb-3">
                  <span className="text-[10px]">🎙️</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)]">
                    {takeaway.session}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="relative pl-4 border-l-2 border-[var(--color-accent)]/30 group-hover:border-[var(--color-accent)]/60 transition-colors">
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                    {takeaway.excerpt}
                  </p>
                </blockquote>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {takeaway.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                        tagColors[tag] || 'bg-[var(--color-mockup-bg)] text-[var(--color-foreground-dim)] border-[var(--color-border-subtle)]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Engagement */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-dim)]">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {takeaway.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-dim)]">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {takeaway.replies} replies
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-[var(--color-foreground-dim)]">
                    🔒 Members only
                  </span>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
