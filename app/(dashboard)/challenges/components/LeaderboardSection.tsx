"use client";

import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { interpolateMsg } from "@/lib/i18n/getErrorMsg";
import { useChallengeLeaderboard, type LeaderboardEntry } from "./hooks/useChallenges";

function LeaderboardRow({ entry, highlight }: { entry: LeaderboardEntry; highlight?: boolean }) {
  const { t } = useTranslation();
  const name = entry.user.name || entry.user.username || t.challenges.member;
  return (
    <li
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${
        highlight ? "bg-accent/10 border border-accent/30" : "border border-transparent"
      }`}
    >
      <span className="w-7 text-sm font-bold text-muted tabular-nums">
        {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
      </span>
      {entry.user.avatar ? (
        <Image src={entry.user.avatar} alt={name} width={28} height={28} className="rounded-full" />
      ) : (
        <span className="w-7 h-7 rounded-full bg-[var(--color-border-subtle)] flex items-center justify-center text-xs font-bold text-muted">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="flex-1 text-sm text-foreground truncate">
        {name}
        {entry.isCurrentUser && <span className="ml-2 text-xs text-accent">{t.challenges.you}</span>}
      </span>
      {entry.completedAt && (
        <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-accent/15 text-accent">
          {t.challenges.done}
        </span>
      )}
      <span className="text-sm text-muted tabular-nums">{entry.tasksCompleted} ✓</span>
    </li>
  );
}

export default function LeaderboardSection({ slug, totalTasks }: { slug: string; totalTasks: number }) {
  const { t } = useTranslation();
  const { data, isLoading } = useChallengeLeaderboard(slug);

  if (isLoading || !data || data.totalParticipants === 0) return null;

  const currentOutsideTop = data.currentUser && !data.entries.some((e) => e.isCurrentUser);

  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-foreground">{t.challenges.leaderboard}</h2>
        <span className="text-xs text-muted">
          {interpolateMsg(
            data.totalParticipants === 1 ? t.challenges.participant : t.challenges.participants,
            { count: String(data.totalParticipants) }
          )}
        </span>
      </div>
      <ul className="space-y-1">
        {data.entries.map((entry) => (
          <LeaderboardRow key={entry.user.id} entry={entry} highlight={entry.isCurrentUser} />
        ))}
        {currentOutsideTop && data.currentUser && (
          <>
            <li className="text-center text-muted text-xs py-1">⋯</li>
            <LeaderboardRow entry={data.currentUser} highlight />
          </>
        )}
      </ul>
      {data.currentUser && !data.currentUser.completedAt && data.currentUser.tasksCompleted < totalTasks && (
        <p className="text-xs text-muted mt-3">
          {t.challenges.climbBoard}
        </p>
      )}
    </section>
  );
}
