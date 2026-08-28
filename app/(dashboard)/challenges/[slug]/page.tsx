"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useChallenge,
  useEnrollInChallenge,
  useCompleteChallengeTask,
} from "../components/hooks/useChallenges";

export default function ChallengeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: challenge, isLoading, error } = useChallenge(slug);
  const enrollMutation = useEnrollInChallenge(slug);
  const completeMutation = useCompleteChallengeTask(slug);
  const [proofDrafts, setProofDrafts] = useState<Record<string, string>>({});
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const completedTaskIds = useMemo(() => {
    return new Set(challenge?.enrollment?.completions.map((c) => c.taskId) ?? []);
  }, [challenge]);

  const totalTasks = challenge?.tasks.length ?? 0;
  const completedCount = completedTaskIds.size;
  const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const tasksByDay = useMemo(() => {
    const groups = new Map<number, NonNullable<typeof challenge>["tasks"]>();
    for (const task of challenge?.tasks ?? []) {
      const arr = groups.get(task.dayNumber) ?? [];
      arr.push(task);
      groups.set(task.dayNumber, arr);
    }
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  }, [challenge]);

  async function handleEnroll() {
    setEnrollError(null);
    const result = await enrollMutation.mutateAsync().catch((e: Error) => {
      setEnrollError(e.message);
      return null;
    });
    if (result?.paymentRequired && result.productSlug) {
      router.push(`/store/${result.productSlug}`);
    }
  }

  async function handleComplete(taskId: string) {
    await completeMutation.mutateAsync({ taskId, proofText: proofDrafts[taskId] || undefined });
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-52 bg-[var(--color-surface)] rounded-2xl mb-6" />
        <div className="h-6 bg-[var(--color-surface)] rounded w-1/2 mb-3" />
        <div className="h-4 bg-[var(--color-surface)] rounded w-3/4" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500">Challenge not found</p>
        <Link href="/challenges" className="text-accent text-sm mt-2 inline-block">
          Back to challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="relative h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5 mb-6">
        {challenge.coverImage ? (
          <Image src={challenge.coverImage} alt={challenge.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🏆</div>
        )}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-sm">
            {challenge.price > 0 ? `$${challenge.price.toFixed(0)} ${challenge.currency}` : "Free"}
          </span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">{challenge.title}</h1>
      <p className="text-sm text-muted mb-4">
        {new Date(challenge.startDate).toLocaleDateString()} – {new Date(challenge.endDate).toLocaleDateString()} ·{" "}
        {challenge._count.enrollments} joined
      </p>
      {challenge.description && <p className="text-sm text-foreground/80 mb-6">{challenge.description}</p>}

      {/* Enroll / paywall / progress */}
      {!challenge.enrolled ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 mb-8 text-center">
          {challenge.paywalled ? (
            <>
              <p className="text-foreground font-semibold mb-1">This is a paid challenge</p>
              <p className="text-sm text-muted mb-4">
                Unlock all {totalTasks} daily tasks for ${challenge.price.toFixed(0)} {challenge.currency}
              </p>
              <button
                onClick={handleEnroll}
                disabled={enrollMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {enrollMutation.isPending ? "Redirecting…" : "Unlock challenge"}
              </button>
            </>
          ) : (
            <>
              <p className="text-foreground font-semibold mb-1">Ready to join?</p>
              <p className="text-sm text-muted mb-4">This challenge is free — join now and start completing daily tasks.</p>
              <button
                onClick={handleEnroll}
                disabled={enrollMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {enrollMutation.isPending ? "Joining…" : "Join challenge"}
              </button>
            </>
          )}
          {enrollError && <p className="text-red-500 text-xs mt-3">{enrollError}</p>}
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {challenge.enrollment?.completedAt ? "Challenge complete! 🎉" : "Your progress"}
            </span>
            <span className="text-sm text-muted">
              {completedCount}/{totalTasks} tasks ({percentage}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-border-subtle)] overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${percentage}%` }} />
          </div>
        </div>
      )}

      {/* Daily tasks */}
      {challenge.enrolled && (
        <div className="space-y-6">
          {tasksByDay.map(([day, tasks]) => (
            <div key={day}>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">Day {day}</h3>
              <div className="space-y-3">
                {tasks.map((task) => {
                  const done = completedTaskIds.has(task.id);
                  return (
                    <div
                      key={task.id}
                      className={`rounded-xl border p-4 ${
                        done
                          ? "bg-accent/5 border-accent/30"
                          : "bg-[var(--color-surface)] border-[var(--color-border-subtle)]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => !done && handleComplete(task.id)}
                          disabled={done || completeMutation.isPending}
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            done ? "bg-accent border-accent" : "border-[var(--color-border-subtle)] hover:border-accent"
                          }`}
                        >
                          {done && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${done ? "text-muted line-through" : "text-foreground"}`}>
                            {task.title}
                          </p>
                          {task.description && <p className="text-xs text-muted mt-1">{task.description}</p>}
                          {!done && (
                            <div className="mt-2 flex gap-2">
                              <input
                                type="text"
                                value={proofDrafts[task.id] ?? ""}
                                onChange={(e) => setProofDrafts((d) => ({ ...d, [task.id]: e.target.value }))}
                                placeholder="Optional proof / notes"
                                className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
