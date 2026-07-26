'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { weeklyLeaderboard, monthlyLeaderboard, type LeaderboardEntry } from '@/lib/data/gamification';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const gamification = useStore((s) => s.gamification);
  const user = useStore((s) => s.currentUser);

  const data = period === 'weekly' ? weeklyLeaderboard : monthlyLeaderboard;

  const myRank = data.findIndex((e) => e.username === user.username) + 1;
  const isTopThree = myRank > 0 && myRank <= 3;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase mb-2">
            {t.leaderboard.title}
          </h1>
          <p className="text-foreground-dim">{t.leaderboard.subtitle}</p>
        </div>

        {/* Period Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          {(['weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-xl font-heading font-bold text-sm transition-all
                ${period === p
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'bg-surface text-foreground-dim border border-surface-light hover:border-accent/30'
                }`}
            >
              {p === 'weekly' ? t.leaderboard.thisWeek : t.leaderboard.thisMonth}
            </button>
          ))}
        </div>

        {/* My Rank Card */}
        {myRank > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-accent/10 border-2 border-accent/30 mx-auto max-w-md"
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center shrink-0
                ${isTopThree ? 'bg-accent text-white' : 'bg-surface-light text-foreground-dim'}
              `}>
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground-muted text-xs uppercase tracking-wider">{t.leaderboard.myRank}</p>
                <p className="font-heading font-bold text-foreground text-lg">#{myRank}</p>
              </div>
              <div className="text-right">
                <p className="text-foreground font-display text-xl">{gamification.xp}</p>
                <p className="text-foreground-dim text-xs">{t.leaderboard.xp}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-surface border border-surface-light text-center mx-auto max-w-md"
          >
            <p className="text-foreground-dim text-sm">
              Start completing lessons to appear on the leaderboard!
            </p>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <div className="rounded-2xl bg-surface border border-surface-light overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[50px_1fr_80px_60px] gap-3 px-5 py-3 border-b border-surface-light bg-white/[0.02]">
            <span className="text-foreground-muted text-[10px] uppercase tracking-wider font-mono">{t.leaderboard.rank}</span>
            <span className="text-foreground-muted text-[10px] uppercase tracking-wider font-mono">{t.leaderboard.name}</span>
            <span className="text-foreground-muted text-[10px] uppercase tracking-wider font-mono text-center">{t.leaderboard.xp}</span>
            <span className="text-foreground-muted text-[10px] uppercase tracking-wider font-mono text-center">{t.leaderboard.streak}</span>
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            <motion.div
              key={period}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {data.map((entry, i) => {
                const isMe = entry.username === user.username;
                const rankColor =
                  entry.rank === 1 ? 'text-yellow-400' :
                  entry.rank === 2 ? 'text-slate-300' :
                  entry.rank === 3 ? 'text-amber-600' :
                  'text-foreground-muted';

                return (
                  <motion.div
                    key={entry.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`
                      grid grid-cols-[50px_1fr_80px_60px] gap-3 px-5 py-3
                      border-b border-surface-light last:border-0
                      ${isMe ? 'bg-accent/5 border-l-2 border-l-accent' : ''}
                      hover:bg-white/[0.02] transition-colors
                    `}
                  >
                    {/* Rank */}
                    <span className={`font-display text-lg ${rankColor}`}>
                      {entry.rank}
                    </span>

                    {/* Name + Badges */}
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <span className="text-foreground text-sm font-medium truncate">
                        {isMe ? 'You' : entry.name.split(' ')[0]}
                      </span>
                      {entry.badges.slice(0, 2).map((b, bi) => (
                        <span key={bi} className="text-xs" title={b}>
                          {b === 'fire' ? '🔥' : b === 'quick-learner' ? '📚' : b === 'learning' ? '🧠' :
                           b === 'social' ? '💬' : b === 'butterfly' ? '🦋' : b === 'pathfinder' ? '🏅' : '⭐'}
                        </span>
                      ))}
                    </div>

                    {/* XP */}
                    <span className="text-foreground text-sm font-mono text-center tabular-nums">{entry.xp}</span>

                    {/* Streak */}
                    <span className="text-foreground-dim text-sm font-mono text-center">
                      {entry.streak > 0 && '🔥'}{entry.streak}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
