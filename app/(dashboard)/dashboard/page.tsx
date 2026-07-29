'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useStore } from '@/lib/store/useStore';
import { useCurrentUser, getFirstName, getAvatarUrl } from '@/lib/hooks/useCurrentUser';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { useTranslation } from '@/lib/i18n/useTranslation';

const UpcomingEventsWidgetLazy = lazy(() => import('@/app/components/UpcomingEventsWidget'));

// ── Circular Progress ────────────────────────────────────────────────────
function CircularProgress({ pct, size = 96, stroke = 6, glow = true }: { pct: number; size?: number; stroke?: number; glow?: boolean }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
        className="text-surface-light" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
        className={glow ? 'text-accent drop-shadow-[0_0_10px_rgba(255,59,48,0.5)]' : 'text-accent'}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
    </svg>
  );
}

// ── Widget wrapper ───────────────────────────────────────────────────────
function Widget({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={`bg-surface border border-surface-light rounded-2xl p-6 ${className}`}>
      {children}
    </motion.div>
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
  const { t } = useTranslation();
  const user = useCurrentUser();
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();
  const posts = useStore((s) => s.posts);
  const joinedSpaces = useStore((s) => s.joinedSpaces);
  const spacesList = [
    { slug: 'growth-hackers', name: 'Growth Hackers', description: 'Growth marketing community', memberCount: 42, category: 'growth' },
    { slug: 'founder-circle', name: 'Founder Circle', description: 'Founders supporting founders', memberCount: 28, category: 'founders' },
  ];

  // Use real API data when available, fall back to Zustand mock
  const realCourses = dashboard?.courses || [];
  const gamificationData = dashboard?.gamification || {
    totalXP: 0, badges: [], streak: { currentStreak: 0, longestStreak: 0 }, certificates: [],
  };
  const upcomingClasses = dashboard?.upcomingClasses || [];

  const enrolledPath = realCourses.length > 0 ? realCourses[0] : null;
  const enrolledProgress = enrolledPath?.percentage ?? 0;

  const latestPosts = posts.slice(0, 3);
  const mySpaces = spacesList.filter((s) => joinedSpaces.includes(s.slug));

  // Daily gem: pick a random course as inspiration
  const dailyGem = enrolledPath || null;

  // Next badge progress (use first unearned badge as target)
  const ALL_BADGES = [
    { id: 'first_steps', name: 'First Steps', icon: '👣', category: 'LEARNING', requirement: 1, description: 'Complete your first lesson' },
    { id: 'streak_3', name: '3-Day Streak', icon: '🔥', category: 'STREAK', requirement: 3, description: 'Maintain a 3-day streak' },
    { id: 'streak_7', name: '7-Day Warrior', icon: '⚔️', category: 'STREAK', requirement: 7, description: 'Maintain a 7-day streak' },
    { id: 'quiz_master', name: 'Quiz Master', icon: '🧠', category: 'LEARNING', requirement: 5, description: 'Pass 5 quizzes' },
    { id: 'course_complete', name: 'Course Graduate', icon: '🎓', category: 'MILESTONE', requirement: 1, description: 'Complete your first course' },
  ];
  const earnedBadgeIds = new Set(gamificationData.badges.map((b) => b.id));
  const nextBadge = ALL_BADGES.find((b) => !earnedBadgeIds.has(b.id)) || null;
  const badgeProgress = nextBadge
    ? Math.min(100, nextBadge.id === 'first_steps' && gamificationData.totalXP > 0 ? 100 : 
      Math.round((gamificationData.streak.currentStreak / nextBadge.requirement) * 100))
    : 0;

  // Onboarding checklist
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const onboardingSteps = [
    {
      label: 'Complete your profile',
      done: Boolean(user?.name),
      href: `/member/${user?.username ?? 'member'}`,
    },
    {
      label: 'Start your first path',
      done: Boolean(enrolledPath),
      href: '/learning',
    },
    {
      label: 'Join a space',
      done: joinedSpaces.length > 0,
      href: '/spaces',
    },
  ];
  const onboardingComplete = onboardingSteps.every((s) => s.done);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">

        {/* ── Gamification Row: Streak + XP + Badge Progress ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Streak */}
          <motion.div variants={fadeUp}>
            <Widget className="!p-4 text-center">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                className="text-2xl block mb-1"
              >🔥</motion.span>
              <p className="text-foreground font-display text-xl leading-none">{gamificationData.streak.currentStreak}</p>
              <p className="text-foreground-muted text-[10px] uppercase tracking-wider mt-1">
                {t.dashboard.dailyStreak.replace('{streak}', String(gamificationData.streak.currentStreak))}
              </p>
            </Widget>
          </motion.div>

          {/* XP */}
          <motion.div variants={fadeUp}>
            <Widget className="!p-4 text-center">
              <span className="text-2xl block mb-1">⚡</span>
              <p className="text-foreground font-display text-xl leading-none">{gamificationData.totalXP}</p>
              <p className="text-foreground-muted text-[10px] uppercase tracking-wider mt-1">{t.dashboard.yourXP}</p>
            </Widget>
          </motion.div>

          {/* Badges */}
          <motion.div variants={fadeUp}>
            <Widget className="!p-4 text-center">
              <span className="text-2xl block mb-1">🏅</span>
              <p className="text-foreground font-display text-xl leading-none">{gamificationData.badges.length}</p>
              <p className="text-foreground-muted text-[10px] uppercase tracking-wider mt-1">Badges</p>
            </Widget>
          </motion.div>

          {/* Next Badge */}
          <motion.div variants={fadeUp}>
            <Widget className="!p-4 text-center">
              {nextBadge ? (
                <>
                  <span className="text-2xl block mb-1">{nextBadge.icon}</span>
                  <div className="w-full h-1.5 bg-surface-light rounded-full mt-1 mb-1 overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${badgeProgress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-foreground-muted text-[10px] uppercase tracking-wider mt-1 leading-tight">
                    {nextBadge.name}
                  </p>
                </>
              ) : (
                <>
                  <span className="text-2xl block mb-1">👑</span>
                  <p className="text-foreground-muted text-[10px] uppercase tracking-wider mt-1">All badges earned!</p>
                </>
              )}
            </Widget>
          </motion.div>
        </div>

        {/* ── Welcome Banner ─────────────────── */}
        <motion.div variants={fadeUp}>
          <Widget className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Image src={user?.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User'} alt={user?.name ?? 'User'}
                width={64} height={64} className="rounded-full border-2 border-white/10 object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-2xl sm:text-3xl text-white uppercase leading-none mb-1">
                  {t.dashboard.welcomeBack} {getFirstName(user?.name)} 👋
                </h1>
                <p className="text-foreground-dim font-body text-sm">
                  {enrolledPath
                    ? t.dashboard.continueJourney.replace('{title}', enrolledPath.title).replace('{pct}', String(enrolledProgress))
                    : t.dashboard.readyToStart}
                </p>
              </div>
              {enrolledPath && (
                <Link
                  href={`/learning/${enrolledPath.slug}`}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-heading font-bold text-sm rounded-xl hover:bg-accent-glow transition-colors"
                >
                  {t.dashboard.continue}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              )}
            </div>
          </Widget>
        </motion.div>

        {/* ── Onboarding Checklist ─────── */}
        {!onboardingComplete && !onboardingDismissed && (
          <motion.div variants={fadeUp}>
            <Widget className="relative overflow-hidden border-accent/20">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.03] via-transparent to-transparent pointer-events-none" />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-lg text-foreground uppercase tracking-wide">
                    Getting Started
                  </h2>
                  <p className="text-foreground-dim text-xs mt-0.5">
                    {onboardingSteps.filter((s) => s.done).length}/{onboardingSteps.length} complete
                  </p>
                </div>
                <button
                  onClick={() => setOnboardingDismissed(true)}
                  className="text-foreground-muted hover:text-foreground transition-colors p-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {onboardingSteps.map((step, i) => (
                  <Link
                    key={i}
                    href={step.href}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      step.done
                        ? 'bg-emerald-500/[0.06] border border-emerald-500/20'
                        : 'bg-white/[0.03] border border-white/[0.06] hover:border-accent/30 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                        step.done
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {step.done ? '✓' : i + 1}
                    </span>
                    <span
                      className={`text-sm flex-1 ${
                        step.done ? 'text-foreground-dim line-through' : 'text-foreground font-medium'
                      }`}
                    >
                      {step.label}
                    </span>
                    {!step.done && (
                      <svg className="w-4 h-4 text-foreground-dim shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </Widget>
          </motion.div>
        )}

        {/* ── Row: Learning Progress + Daily Gem ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Progress */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <Widget className="h-full flex flex-col items-center text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted mb-4">
                {t.dashboard.yourLearning}
              </p>
              {enrolledPath ? (
                <>
                  <div className="relative mb-4">
                    <CircularProgress pct={enrolledProgress} size={120} stroke={8} />
                    <span className="absolute inset-0 flex items-center justify-center font-display text-2xl text-foreground">
                      {enrolledProgress}%
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-1">
                    {enrolledPath.title}
                  </h3>
                  <p className="text-foreground-dim text-sm mb-5">
                    {enrolledProgress === 100 ? t.dashboard.completed : t.dashboard.completePct.replace('{pct}', String(enrolledProgress))}
                  </p>
                  <Link
                    href={`/learning/${enrolledPath.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 border border-accent/30 text-accent font-heading font-bold text-sm rounded-xl hover:bg-accent/20 transition-colors"
                  >
                    {t.dashboard.continueLearning}
                  </Link>
                </>
              ) : (
                <div className="py-8">
                  <p className="text-foreground-dim text-sm mb-4">{t.dashboard.noActivePaths}</p>
                  <Link
                    href="/learning"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-heading font-bold text-sm rounded-xl hover:bg-accent-glow transition-colors"
                  >
                    {t.dashboard.browsePaths}
                  </Link>
                </div>
              )}
            </Widget>
          </motion.div>

          {/* Daily Gem + Friends Activity */}
          <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
            {/* Today's 5-Minute Gem */}
            {dailyGem && (
            <Widget className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-3xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💎</span>
                <h2 className="font-heading font-bold text-foreground text-lg">{t.dashboard.todayGem}</h2>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-3xl flex-shrink-0">💡</span>
                <div className="min-w-0">
                  <p className="text-foreground-muted text-xs uppercase tracking-wider mb-1">Daily Gem</p>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{dailyGem.title}</h3>
                  <p className="text-foreground-dim text-sm leading-relaxed line-clamp-2">{dailyGem.tagline}</p>
                </div>
              </div>
              <Link
                href={`/learning/${dailyGem.slug}`}
                className="inline-flex items-center gap-1.5 mt-4 text-accent text-sm font-medium hover:underline"
              >
                {t.dashboard.startReading}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </Widget>
            )}

            {/* Recent Activity */}
            <Widget>
              <h2 className="font-heading font-bold text-foreground text-lg mb-4">{t.dashboard.friendsActivity}</h2>
              <div className="space-y-3">
                {latestPosts.length > 0 ? latestPosts.map((post) => (
                  <div key={post.id} className="flex items-center gap-3">
                    <Image src={post.author.avatar} alt={post.author.name}
                      width={32} height={32} className="rounded-full border border-white/10 object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm">
                        <span className="font-semibold">{post.author.name}</span>{' '}
                        <span className="text-foreground-dim">shared</span>
                      </p>
                      <p className="text-foreground-dim text-xs truncate">{post.text}</p>
                      <span className="text-foreground-muted text-xs">{post.timestamp}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-foreground-dim text-sm py-4 text-center">No recent activity yet. Start learning to see updates!</p>
                )}
              </div>
            </Widget>
          </motion.div>
        </div>

        {/* ── Row: Community Feed ─── */}
        <motion.div variants={fadeUp}>
          <Widget>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-foreground text-lg">{t.dashboard.communityFeed}</h2>
              <Link href="/community" className="text-accent font-mono text-xs hover:underline">
                {t.dashboard.viewAll}
              </Link>
            </div>
            <div className="space-y-4">
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex gap-3 pb-4 border-b border-surface-light last:border-0 last:pb-0"
                >
                  <Image src={post.author.avatar} alt={post.author.name}
                    width={32} height={32} className="rounded-full border border-white/10 object-cover shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-foreground text-sm">{post.author.name}</span>
                      <span className="text-foreground-muted text-xs font-mono">{post.timestamp}</span>
                    </div>
                    <p className="text-foreground-dim text-sm line-clamp-2">{post.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-foreground-muted text-xs">
                        <svg className={`w-3.5 h-3.5 ${post.liked ? 'text-accent' : ''}`} viewBox="0 0 24 24" fill={post.liked ? 'currentColor' : 'none'}
                          stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        {post.likes}
                      </span>
                      <span className="text-foreground-muted text-xs">
                        {post.comments.length} {post.comments.length === 1 ? t.dashboard.comment : t.dashboard.comments}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Widget>
        </motion.div>

        {/* ── Row: My Spaces + Events ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Spaces */}
          <motion.div variants={fadeUp}>
            <Widget>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-foreground text-lg">{t.dashboard.mySpaces}</h2>
                <Link href="/spaces" className="text-accent font-mono text-xs hover:underline">
                  {t.dashboard.browseAll}
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
                          <div key={i} className="w-6 h-6 rounded-full bg-surface border-2 border-surface-light flex items-center justify-center text-[8px] font-mono text-foreground-muted">
                            {space.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-foreground text-sm font-medium group-hover:text-accent transition-colors">
                        {space.name}
                      </span>
                      <span className="text-foreground-muted text-xs font-mono">{space.memberCount}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-foreground-dim text-sm">{t.dashboard.joinSpacePrompt}</p>
              )}
              <Link href="/leaderboard" className="inline-flex items-center gap-1.5 mt-4 text-accent text-xs font-medium hover:underline">
                {t.dashboard.leaderboard} 🏆
              </Link>
            </Widget>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div variants={fadeUp}>
            <Widget>
              <h2 className="font-heading font-bold text-foreground text-lg mb-5">{t.dashboard.upcomingEvents}</h2>
              <div className="space-y-4">
                {upcomingClasses.length > 0 ? upcomingClasses.slice(0, 3).map((cls) => {
                  const date = new Date(cls.startsAt);
                  return (
                    <div key={cls.id} className="flex gap-4 p-3 rounded-xl bg-surface-light/50 border border-white/5 hover:border-accent/20 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex flex-col items-center justify-center shrink-0">
                        <span className="font-display text-accent text-lg leading-none">{date.getDate()}</span>
                        <span className="text-accent/60 text-[9px] font-mono uppercase">{date.toLocaleString('en-US', { month: 'short' })}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading font-bold text-foreground text-sm mb-0.5">{cls.title}</h3>
                        <p className="text-foreground-muted text-xs font-mono">
                          {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • {cls.instructor}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-foreground-dim text-sm py-4 text-center">No upcoming live classes. Check back soon!</p>
                )}
              </div>
            </Widget>
          </motion.div>

          {/* Community Events */}
          <motion.div variants={fadeUp}>
            <Suspense fallback={null}>
              <UpcomingEventsWidgetLazy />
            </Suspense>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
