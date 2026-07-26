'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/lib/store/useStore';
import { upcomingEvents } from '@/lib/data/events';
import { learningPaths } from '@/lib/data/learning-paths';
import { spaces as allSpaces } from '@/lib/data/spaces';

// ── Circular Progress ────────────────────────────────────────────────────
function CircularProgress({ pct, size = 96, stroke = 6 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
        className="text-surface-light" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
        className="text-accent drop-shadow-[0_0_10px_rgba(255,59,48,0.5)]"
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
    </svg>
  );
}

// ── Widget wrapper ───────────────────────────────────────────────────────
function Widget({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-surface-light rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ── Main Dashboard ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const user = useStore((s) => s.currentUser);
  const progress = useStore((s) => s.progress);
  const posts = useStore((s) => s.posts);
  const joinedSpaces = useStore((s) => s.joinedSpaces);
  const getPathProgress = useStore((s) => s.getPathProgress);

  const enrolledPath = learningPaths.find((lp) => progress[lp.slug]);
  const enrolledProgress = enrolledPath
    ? getPathProgress(
        enrolledPath.slug,
        enrolledPath.modules.reduce((sum, m) => sum + m.lessons.length, 0)
      )
    : 0;

  const latestPosts = posts.slice(0, 3);

  const mySpaces = allSpaces.filter((s) => joinedSpaces.includes(s.slug));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
        {/* ── Welcome Banner ─────────────────── */}
        <motion.div variants={fadeUp}>
          <Widget className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img src={user.avatar} alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-white/10 object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-2xl sm:text-3xl text-white uppercase leading-none mb-1">
                  Welcome back, {user.name.split(' ')[0]} 👋
                </h1>
                <p className="text-muted font-body text-sm">
                  {enrolledPath
                    ? `Continue your learning journey — "${enrolledPath.title}" is ${enrolledProgress}% complete.`
                    : 'Ready to start learning? Pick a path below.'}
                </p>
              </div>
              {enrolledPath && (
                <Link
                  href={`/learning/${enrolledPath.slug}`}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-heading font-bold text-sm rounded-xl hover:bg-accent-glow transition-colors"
                >
                  Continue
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              )}
            </div>
          </Widget>
        </motion.div>

        {/* ── Row: Learning Progress + Feed ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Progress */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <Widget className="h-full flex flex-col items-center text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
                Your Learning
              </p>
              {enrolledPath ? (
                <>
                  <div className="relative mb-4">
                    <CircularProgress pct={enrolledProgress} size={120} stroke={8} />
                    <span className="absolute inset-0 flex items-center justify-center font-display text-2xl text-white">
                      {enrolledProgress}%
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg mb-1">
                    {enrolledPath.title}
                  </h3>
                  <p className="text-muted text-sm mb-5">
                    {enrolledProgress === 100 ? 'Completed! 🎉' : `${enrolledProgress}% complete`}
                  </p>
                  <Link
                    href={`/learning/${enrolledPath.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 border border-accent/30 text-accent font-heading font-bold text-sm rounded-xl hover:bg-accent/20 transition-colors"
                  >
                    Continue Learning
                  </Link>
                </>
              ) : (
                <div className="py-8">
                  <p className="text-muted text-sm mb-4">No active learning paths yet.</p>
                  <Link
                    href="/learning"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-heading font-bold text-sm rounded-xl hover:bg-accent-glow transition-colors"
                  >
                    Browse Paths
                  </Link>
                </div>
              )}
            </Widget>
          </motion.div>

          {/* Community Feed Preview */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <Widget>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-white text-lg">Community Feed</h2>
                <Link href="/community" className="text-accent font-mono text-xs hover:underline">
                  View all →
                </Link>
              </div>
              <div className="space-y-4">
                {latestPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex gap-3 pb-4 border-b border-surface-light last:border-0 last:pb-0"
                  >
                    <img src={post.author.avatar} alt={post.author.name}
                      className="w-8 h-8 rounded-full border border-white/10 object-cover shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-bold text-white text-sm">{post.author.name}</span>
                        <span className="text-muted text-xs font-mono">{post.timestamp}</span>
                      </div>
                      <p className="text-white/70 text-sm line-clamp-2">{post.text}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-muted text-xs">
                          <svg className={`w-3.5 h-3.5 ${post.liked ? 'text-accent' : ''}`} viewBox="0 0 24 24" fill={post.liked ? 'currentColor' : 'none'}
                            stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                          </svg>
                          {post.likes}
                        </span>
                        <span className="text-muted text-xs">
                          {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          </motion.div>
        </div>

        {/* ── Row: My Spaces + Events ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Spaces */}
          <motion.div variants={fadeUp}>
            <Widget>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-white text-lg">My Spaces</h2>
                <Link href="/spaces" className="text-accent font-mono text-xs hover:underline">
                  Browse all →
                </Link>
              </div>
              {mySpaces.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {mySpaces.map((space) => (
                    <Link
                      key={space.slug}
                      href={`/spaces/${space.slug}`}
                      className="flex items-center gap-2 px-3 py-2 bg-surface-light rounded-xl border border-white/5 hover:border-accent/30 transition-colors group"
                    >
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-surface border-2 border-surface-light flex items-center justify-center text-[8px] font-mono text-muted">
                            {space.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-white text-sm font-medium group-hover:text-accent transition-colors">
                        {space.name}
                      </span>
                      <span className="text-muted text-xs font-mono">{space.memberCount}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">Join a space to connect with like-minded founders.</p>
              )}
            </Widget>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div variants={fadeUp}>
            <Widget>
              <h2 className="font-heading font-bold text-white text-lg mb-5">Upcoming Events</h2>
              <div className="space-y-4">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex gap-4 p-3 rounded-xl bg-surface-light/50 border border-white/5 hover:border-accent/20 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex flex-col items-center justify-center shrink-0">
                      <span className="font-display text-accent text-lg leading-none">{event.date.split(' ')[1].replace(',', '')}</span>
                      <span className="text-accent/60 text-[9px] font-mono uppercase">{event.date.split(' ')[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-white text-sm mb-0.5">{event.title}</h3>
                      <p className="text-muted text-xs font-mono">{event.time} • {event.attendees} attending</p>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
