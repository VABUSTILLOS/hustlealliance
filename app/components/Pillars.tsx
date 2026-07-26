'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: 'Community',
    description:
      'Real-time founder chats, mastermind groups, and a network that actually responds.',
    device: 'phone',
  },
  {
    title: 'Your Own Website',
    description:
      'Custom domain, professional branding, and a landing page that converts — zero code required.',
    device: 'laptop',
  },
  {
    title: 'Guides & Resources',
    description:
      '180+ playbooks, templates, and tools built by founders who\'ve been in the trenches.',
    device: 'tablet',
  },
];

function DeviceMockup({ type }: { type: string }) {
  switch (type) {
    case 'phone':
      return (
        <div className="relative mx-auto w-36 h-64 sm:w-44 sm:h-80">
          <div className="absolute inset-0 rounded-[24px] bg-surface-light border-2 border-white/10 overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-10 bg-black/40 border-b border-white/5 px-3 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent/60" />
              <div className="w-2 h-2 rounded-full bg-accent/40" />
              <div className="w-2 h-2 rounded-full bg-accent/20" />
            </div>
            <div className="absolute top-14 left-2 right-2 space-y-2.5 px-1">
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-accent/30 flex-shrink-0" />
                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-3 py-2 text-[10px] text-white/60 w-3/4">
                  Anyone else launching this month? 🚀
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="bg-accent/20 rounded-2xl rounded-tr-sm px-3 py-2 text-[10px] text-white/80 w-2/3">
                  Yep! B2B SaaS, you?
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-accent-glow/30 flex-shrink-0" />
                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-3 py-2 text-[10px] text-white/60 w-3/4">
                  Marketplace for creators 🔥
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full" />
          </div>
        </div>
      );
    case 'laptop':
      return (
        <div className="relative mx-auto w-56 sm:w-72">
          <div className="bg-surface-light border-2 border-white/10 rounded-t-xl overflow-hidden shadow-2xl">
            <div className="h-7 bg-black/40 border-b border-white/5 flex items-center gap-1.5 px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent/20" />
              <div className="ml-4 flex-1 h-4 bg-white/5 rounded-full px-3 flex items-center">
                <span className="text-[8px] text-white/30">yourstartup.com</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/30" />
                <div>
                  <div className="h-3 w-20 bg-white/10 rounded mb-1" />
                  <div className="h-2 w-14 bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-20 bg-gradient-to-br from-accent/10 to-accent-glow/5 rounded-lg" />
              <div className="space-y-2">
                <div className="h-2 w-full bg-white/5 rounded" />
                <div className="h-2 w-3/4 bg-white/5 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-16 flex-1 bg-white/5 rounded-lg" />
                <div className="h-16 flex-1 bg-accent/10 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="h-3 bg-surface-light border-2 border-white/10 border-t-0 rounded-b-lg" />
          <div className="h-1.5 w-32 mx-auto bg-surface-light border border-white/10 border-t-0 rounded-b-md" />
        </div>
      );
    case 'tablet':
      return (
        <div className="relative mx-auto w-48 h-64 sm:w-56 sm:h-72">
          <div className="absolute inset-0 rounded-2xl bg-surface-light border-2 border-white/10 overflow-hidden shadow-2xl">
            <div className="h-6 bg-black/40 border-b border-white/5 flex items-center justify-between px-3">
              <span className="text-[8px] text-white/30">9:41</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-lg bg-gradient-to-b from-accent/20 to-surface flex items-center justify-center border border-white/5"
                >
                  <div className="text-center px-2">
                    <div className="h-1.5 w-12 bg-accent/40 rounded mx-auto mb-1.5" />
                    <div className="h-1 w-8 bg-white/10 rounded mx-auto" />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center border border-accent/30">
              <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function Pillars() {
  return (
    <section className="relative py-24 lg:py-32 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            Everything you need
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-none uppercase">
            What you get
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group cursor-pointer"
            >
              <div className="bg-surface border border-surface-light rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_20px_60px_rgba(255,59,48,0.1)]">
                <div className="mb-8">
                  <DeviceMockup type={feature.device} />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3 pb-3 relative inline-block">
                  {feature.title}
                  <span className="absolute bottom-0 left-0 w-8 h-[3px] bg-accent rounded-full transition-all duration-300 group-hover:w-full" />
                </h3>
                <p className="text-muted font-body text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="#pricing"
            className="font-mono text-xs uppercase tracking-[0.15em] text-accent hover:text-accent-glow transition-colors inline-flex items-center gap-2"
          >
            View all features
            <span className="text-lg leading-none">&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
