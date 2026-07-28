'use client';

import { useState, use, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useLesson, useCourse } from '@/lib/hooks/useCourses';
import { useAccessCheck } from '@/lib/hooks/useAccessCheck';
import { useDripStatus } from '@/lib/hooks/useDripStatus';
import { completeLessonAction } from '@/app/actions/learning';
import { useStore } from '@/lib/store/useStore';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Paywall from '@/app/components/Paywall';
import QuizPlayer from '@/app/components/QuizPlayer';
import type { UpgradeOption } from '@/app/components/Paywall';

export default function LessonPlayerPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = use(params);
  const { t } = useTranslation();

  const { data: course } = useCourse(slug);
  const { data: lesson, isLoading: lessonLoading } = useLesson(slug, lessonSlug);
  const { data: access, isLoading: accessLoading } = useAccessCheck({
    courseId: course?.id,
    lessonId: lesson?.id,
    enabled: !!course?.id,
  });
  const { data: dripStatus, isLoading: dripLoading } = useDripStatus(lesson?.id);

  const completeLesson = useStore((s) => s.completeLesson);
  const isLessonComplete = useStore((s) => s.isLessonComplete);
  const hasCheered = useStore((s) => s.hasCheered);
  const toggleCheer = useStore((s) => s.toggleCheer);
  const addPost = useStore((s) => s.addPost);
  const user = useCurrentUser();
  const posts = useStore((s) => s.posts);

  const [showCelebration, setShowCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [activeTab, setActiveTab] = useState<'content' | 'discuss'>('content');
  const completed = lesson ? isLessonComplete(slug, lesson.slug) : false;
  const cheered = lesson ? hasCheered(slug, lesson.slug) : false;

  const discussPosts = posts.filter(
    (p) => p.space === slug || !p.space
  ).slice(0, 4);

  // Build lesson list from course modules
  const allLessons: { lesson: { id: string; title: string; slug: string; durationMinutes: number }; moduleIdx: number; lessonIdx: number }[] = [];
  course?.modules.forEach((mod, mi) => {
    mod.lessons.forEach((l, li) => {
      allLessons.push({ lesson: l, moduleIdx: mi, lessonIdx: li });
    });
  });

  const currentIdx = allLessons.findIndex((l) => l.lesson.slug === lessonSlug);
  const prev = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const next = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const handleComplete = async () => {
    if (lesson && !completed) {
      // Call server action for real db persistence + gamification
      const result = await completeLessonAction(lesson.id);
      // Also update local Zustand for optimistic UI
      completeLesson(slug, lesson.slug);
      setXpEarned(result.success ? (result.xpEarned ?? 10) : 10);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handleCheer = () => {
    if (lesson) toggleCheer(slug, lesson.slug);
  };

  const handleShareWin = () => {
    if (!lesson || !course) return;
    addPost({
      id: `post-${Date.now()}`,
      author: {
        name: user?.name ?? 'Member',
        avatar: user?.avatar ?? 'https://api.dicebear.com/9.x/initials/svg?seed=User',
        username: user?.username ?? user?.email?.split('@')[0] ?? 'member',
      },
      text: `🎉 ${t.gamification.sharedWin} "${lesson.title}" ${t.gamification.from} "${course.title}"!`,
      timestamp: 'Just now',
      likes: 0,
      liked: false,
      comments: [],
      space: slug,
      image: undefined,
    });
  };

  // Loading state
  if (lessonLoading || accessLoading || dripLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-4 bg-surface-light rounded w-1/4" />
        <div className="aspect-video bg-surface-light rounded-2xl" />
        <div className="h-8 bg-surface-light rounded w-1/2" />
        <div className="h-40 bg-surface-light rounded-2xl" />
      </div>
    );
  }

  // Not found
  if (!lesson) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-foreground mb-4">{t.lesson.notFound}</h1>
        <Link href={`/learning/${slug}`} className="text-accent font-mono text-sm">← {t.lesson.backToPath}</Link>
      </div>
    );
  }

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => isLessonComplete(slug, l.lesson.slug)).length;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Access denied — show paywall
  const showPaywall = access && !access.allowed;

  // Drip/prerequisite lock — show scheduled unlock
  const showDripLock = dripStatus && !dripStatus.allowed && (!access || access.allowed);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href={`/learning/${slug}`}
        className="inline-flex items-center gap-1 text-muted font-mono text-xs hover:text-accent mb-6 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        {t.lesson.backTo} {course?.title || slug}
      </Link>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-muted text-xs font-mono">{completedCount}/{totalLessons}</span>
      </div>

      {/* Lesson content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Paywall or video */}
          {/* Drip feed / prerequisite lock */}
          {showDripLock ? (
            <div className="max-w-lg">
              {dripStatus.reason === 'prerequisite_locked' ? (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 text-center space-y-4">
                  <span className="text-4xl block">🔐</span>
                  <h2 className="font-display text-xl text-foreground uppercase">{t.lesson.prerequisiteLocked}</h2>
                  <p className="text-foreground-dim text-sm">
                    {t.lesson.prerequisiteHint}{' '}
                    &ldquo;{lesson.title}&rdquo;
                  </p>
                  <ul className="space-y-2 text-left">
                    {dripStatus.missingPrerequisites.map((p) => (
                      <li key={p.id} className="flex items-center gap-2 text-sm text-foreground-dim">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
                        {p.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-8 text-center space-y-4">
                  <span className="text-4xl block">⏳</span>
                  <h2 className="font-display text-xl text-foreground uppercase">{t.lesson.dripLocked}</h2>
                  <p className="text-foreground-dim text-sm">
                    &ldquo;{lesson.title}&rdquo;{' '}
                    {t.lesson.dripUnlocksAt.replace('{date}',
                      dripStatus.releasesAt
                        ? new Date(dripStatus.releasesAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'completing previous lessons'
                    )}
                  </p>
                  <p className="text-foreground-muted text-xs">
                    {t.lesson.dripComingSoon}
                  </p>
                </div>
              )}
            </div>
          ) : showPaywall ? (
            <div className="max-w-lg">
              <Paywall
                requiredTier={access.requiredTier}
                userTier={access.userTier}
                upgradeOptions={(access.upgradeOptions || []) as UpgradeOption[]}
                contentTitle={course?.title || lesson.title}
                contentDescription={`"${lesson.title}" requires ${access.requiredTier} tier access.`}
              />
            </div>
          ) : (
            <>
              {/* Video */}
              <div className="aspect-video bg-surface border border-surface-light rounded-2xl overflow-hidden">
                {lesson.videoUrl ? (
                  <iframe src={lesson.videoUrl} className="w-full h-full" allowFullScreen title={lesson.title} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                    <svg className="w-12 h-12 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="3" width="20" height="14" rx="2" /><polygon points="8 21 12 17 16 21" />
                    </svg>
                    <p className="font-heading font-bold text-lg">{t.lesson.locked}</p>
                    <p className="text-sm">{t.lesson.lockedHint}</p>
                  </div>
                )}
              </div>

              {/* Title & Mark Complete */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl text-foreground uppercase leading-none mb-1">
                    {lesson.title}
                  </h1>
                  <p className="font-mono text-xs text-muted">{lesson.durationMinutes} min</p>
                </div>
                <button
                  onClick={handleComplete}
                  className={clsx(
                    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all',
                    completed
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 cursor-default'
                      : 'bg-accent text-foreground hover:bg-accent-glow shadow-[0_0_20px_rgba(255,59,48,0.2)]'
                  )}
                  disabled={completed}
                >
                  {completed ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {t.lesson.completed}
                    </>
                  ) : (
                    t.lesson.markComplete
                  )}
                </button>
              </div>

              {/* Content + Tab Bar */}
              <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden">
                {lesson.lessonType === 'QUIZ' && lesson.quiz ? (
                  <div className="p-6 lg:p-8">
                    <QuizPlayer
                      quiz={{
                        id: lesson.quiz.id,
                        title: lesson.quiz.title,
                        passingScore: lesson.quiz.passingScore,
                        timeLimitMinutes: lesson.quiz.timeLimitMinutes,
                        randomizeOrder: lesson.quiz.randomizeOrder,
                        maxAttempts: lesson.quiz.maxAttempts,
                        questions: lesson.quiz.questions,
                        _count: lesson.quiz._count,
                      }}
                      onComplete={(passed, score) => {
                        if (passed) handleComplete();
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Tab Bar */}
                    <div className="flex border-b border-surface-light">
                      {(['content', 'discuss'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={clsx(
                            'flex-1 py-3 text-sm font-heading font-bold transition-colors',
                            activeTab === tab
                              ? 'text-accent border-b-2 border-accent'
                              : 'text-foreground-dim hover:text-foreground'
                          )}
                        >
                          {tab === 'content' ? lesson.title : t.gamification.discussTab}
                        </button>
                      ))}
                    </div>

                    {activeTab === 'content' ? (
                      <>
                        <div className="p-6 lg:p-8">
                          <div className="prose prose-invert max-w-none text-foreground-muted text-sm leading-relaxed whitespace-pre-wrap">
                            {lesson.content || 'No content available for this lesson.'}
                          </div>
                        </div>

                    {/* Cheer & Share */}
                    <div className="flex items-center gap-3 px-6 pb-6 border-t border-surface-light pt-4">
                      <button
                        onClick={handleCheer}
                        className={clsx(
                          'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-bold transition-all',
                          cheered
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            : 'bg-white/5 border border-white/10 text-foreground-dim hover:text-amber-400 hover:border-amber-500/30'
                        )}
                      >
                        <motion.span
                          animate={cheered ? { scale: [1, 1.3, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          👏
                        </motion.span>
                        {cheered ? t.gamification.cheers + '!' : t.gamification.cheerThis}
                      </button>
                      {completed && (
                        <button
                          onClick={handleShareWin}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-bold
                            bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-all"
                        >
                          📢 {t.gamification.shareWin}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  /* Discuss Tab */
                  <div className="p-6">
                    {discussPosts.length > 0 ? (
                      <div className="space-y-4">
                        {discussPosts.map((post) => (
                          <div key={post.id} className="flex gap-3 pb-4 border-b border-surface-light last:border-0 last:pb-0">
                            <Image src={post.author.avatar} alt={post.author.name}
                              width={32} height={32} className="rounded-full border border-white/10 shrink-0 object-cover" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-foreground text-sm font-semibold">{post.author.name}</span>
                                <span className="text-foreground-dim text-xs">{post.timestamp}</span>
                              </div>
                              <p className="text-foreground-dim text-sm">{post.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground-dim text-sm text-center py-8">
                        No discussions yet. Be the first to share your thoughts!
                      </p>
                    )}
                  </div>
                )}
                </>
              )}
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between pt-4">
                {prev ? (
                  <Link
                    href={`/learning/${slug}/${prev.lesson.slug}`}
                    className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                    {prev.lesson.title}
                  </Link>
                ) : <div />}
                {next ? (
                  <Link
                    href={`/learning/${slug}/${next.lesson.slug}`}
                    className="flex items-center gap-2 text-accent hover:text-accent-glow transition-colors text-sm font-medium"
                  >
                    {next.lesson.title}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </Link>
                ) : <div />}
              </div>
            </>
          )}
        </div>

        {/* Lesson list sidebar */}
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3 px-1">{t.lesson.lessons}</p>
          {allLessons.map((item, i) => {
            const isActive = item.lesson.slug === lessonSlug;
            const isDone = isLessonComplete(slug, item.lesson.slug);
            const isPaywallLocked = showPaywall && !isActive;
            const isDripLocked = !isActive && showDripLock;
            const isAnyLocked = isPaywallLocked || isDripLocked;
            return (
              <Link
                key={item.lesson.slug}
                href={isAnyLocked ? '#' : `/learning/${slug}/${item.lesson.slug}`}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive && 'bg-accent/10 border border-accent/20',
                  !isActive && 'hover:bg-surface-light/50',
                  isPaywallLocked && 'opacity-40 pointer-events-none',
                  isDripLocked && 'opacity-60 cursor-not-allowed'
                )}
              >
                <span className={clsx(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0',
                  isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  isActive ? 'bg-accent/20 text-accent border border-accent/30' :
                  'bg-surface-light text-muted border border-white/5'
                )}>
                  {isDone ? '✓' : i + 1}
                </span>
                <span className={clsx('truncate', isActive ? 'text-foreground' : 'text-muted')}>
                  {item.lesson.title}
                </span>
                {isPaywallLocked && (
                  <svg className="w-3.5 h-3.5 text-muted shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                )}
                {isDripLocked && (
                  <span className="text-[10px] shrink-0 ml-auto" title="Not yet unlocked">⏳</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Celebration overlay with confetti */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
        >
          {/* Confetti particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl pointer-events-none"
              initial={{ x: '50%', y: '50%', opacity: 0, scale: 0 }}
              animate={{
                x: `${30 + Math.random() * 40}%`,
                y: `${20 + Math.random() * 60}%`,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: Math.random() * 720,
              }}
              transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.3, ease: 'easeOut' }}
            >
              {['🎉', '✨', '🌟', '💫', '🔥', '🏆', '⚡', '💎'][i % 8]}
            </motion.div>
          ))}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: 3, duration: 0.5 }}
            className="bg-surface border-2 border-accent/40 rounded-3xl p-10 text-center shadow-[0_0_80px_rgba(255,59,48,0.3)]"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <p className="font-display text-2xl text-foreground uppercase">{t.lesson.completedTitle}</p>
            <p className="text-foreground-dim text-sm mt-2">{t.lesson.completedSub}</p>
            <p className="text-accent text-sm font-bold mt-3">+{xpEarned} XP earned!</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
