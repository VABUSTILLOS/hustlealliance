'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store/useStore';
import { useEffect, useState, useRef } from 'react';
import { badges as allBadges } from '@/lib/data/gamification';
import BadgeUnlock from './BadgeUnlock';
import { useToast } from './ToastProvider';

export default function GamificationWidget() {
  const { gamification, checkDailyLogin, getNextBadge, clearLatestBadge } = useStore();
  const [xpAnimate, setXpAnimate] = useState(false);
  const { addToast } = useToast();
  const prevStreak = useRef(gamification.streak);
  const prevBadgeCount = useRef(gamification.earnedBadges.length);

  useEffect(() => {
    checkDailyLogin();
  }, []);

  const streak = gamification.streak;
  const xp = gamification.xp;
  const badgeCount = gamification.earnedBadges.length;
  const nextBadge = getNextBadge();
  const latestBadge = gamification.latestUnlockedBadge
    ? allBadges.find(b => b.id === gamification.latestUnlockedBadge)
    : null;

  // Toast for streak increase
  useEffect(() => {
    if (streak > prevStreak.current && prevStreak.current > 0) {
      addToast({
        message: `${streak}-day streak! Keep the fire burning!`,
        icon: '🔥',
        type: 'streak',
      });
    }
    prevStreak.current = streak;
  }, [streak, addToast]);

  // Toast for badge unlock
  useEffect(() => {
    if (badgeCount > prevBadgeCount.current) {
      const newBadgeId = gamification.earnedBadges[badgeCount - 1];
      const newBadge = allBadges.find(b => b.id === newBadgeId);
      if (newBadge) {
        addToast({
          message: `Badge unlocked: ${newBadge.name}! ${newBadge.icon}`,
          icon: newBadge.icon,
          type: 'success',
          duration: 5000,
        });
      }
    }
    prevBadgeCount.current = badgeCount;
  }, [badgeCount, addToast, gamification.earnedBadges]);

  // Animate XP counter
  useEffect(() => {
    setXpAnimate(true);
    const t = setTimeout(() => setXpAnimate(false), 400);
    return () => clearTimeout(t);
  }, [xp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-6 right-6 z-[150]"
    >
      <div className="relative">
        {/* Glow background */}
        <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-xl" />

        <div className="relative flex items-center gap-3 px-4 py-3 rounded-2xl
          bg-surface/90 backdrop-blur-md border border-white/10
          shadow-lg shadow-black/20">
          {/* Streak */}
          <div className="flex items-center gap-1.5">
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              className="text-lg"
            >
              🔥
            </motion.span>
            <span className="text-foreground font-bold text-sm">{streak}</span>
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* XP */}
          <div className="flex items-center gap-1">
            <motion.span
              animate={xpAnimate ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              className="text-lg"
            >
              ⚡
            </motion.span>
            <span className="text-foreground font-bold text-sm">{xp} XP</span>
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* Badges */}
          <div className="flex items-center gap-1">
            <span className="text-lg">🏅</span>
            <span className="text-foreground font-bold text-sm">{badgeCount}</span>
          </div>

          {/* Next badge progress bar */}
          {nextBadge && (
            <>
              <div className="w-px h-5 bg-white/10" />

              <div className="flex flex-col items-center min-w-[50px]">
                <div className="flex items-center gap-1">
                  <span className="text-xs">{nextBadge.badge.icon}</span>
                  <span className="text-[10px] text-foreground-muted truncate max-w-[60px]">
                    {nextBadge.badge.name}
                  </span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${nextBadge.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[10px] text-foreground-muted mt-0.5">
                  {Math.round(nextBadge.progress)}%
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badge Unlock Celebration */}
      {latestBadge && (
        <BadgeUnlock
          badge={latestBadge}
          onClose={clearLatestBadge}
        />
      )}
    </motion.div>
  );
}
