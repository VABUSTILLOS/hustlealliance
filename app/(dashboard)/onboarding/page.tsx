"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { interpolateMsg } from "@/lib/i18n/getErrorMsg";

type OnboardingQuestion = {
  id: string;
  question: string;
  type: "TEXT" | "SELECT" | "MULTI_SELECT";
  options: string[];
};

type ExistingAnswer = {
  questionId: string;
  answer: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [step, setStep] = useState(0); // 0 = welcome, 1..N = questions, N+1 = done
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const statusRes = await fetch("/api/onboarding/status");
        if (statusRes.ok) {
          const status = await statusRes.json();
          if (status.completed) {
            router.replace("/dashboard");
            return;
          }
        }

        const res = await fetch("/api/onboarding/questions");
        if (!res.ok) throw new Error("Failed to load onboarding questions");
        const data = await res.json();
        if (cancelled) return;

        const qs: OnboardingQuestion[] = data.questions ?? [];
        const existing: ExistingAnswer[] = data.answers ?? [];
        const initial: Record<string, string | string[]> = {};
        for (const a of existing) {
          const q = qs.find((q) => q.id === a.questionId);
          if (q?.type === "MULTI_SELECT") {
            try {
              initial[a.questionId] = JSON.parse(a.answer);
            } catch {
              initial[a.questionId] = [];
            }
          } else {
            initial[a.questionId] = a.answer;
          }
        }

        setQuestions(qs);
        setAnswers(initial);
        setLoadError(null);
      } catch {
        if (!cancelled) {
          setLoadError(t.onboarding.loadFailed);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [router, reloadKey, t.onboarding.loadFailed]);

  const totalSteps = questions.length + 2; // welcome + questions + done
  const isWelcome = step === 0;
  const isDone = step === totalSteps - 1;
  const currentQuestion = !isWelcome && !isDone ? questions[step - 1] : null;

  const progressPct = useMemo(() => {
    if (totalSteps <= 1) return 100;
    return Math.round((step / (totalSteps - 1)) * 100);
  }, [step, totalSteps]);

  function setAnswer(questionId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function toggleMultiOption(questionId: string, option: string) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [questionId]: next };
    });
  }

  async function handleFinish() {
    setSubmitting(true);
    setFinishError(null);
    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      // Best-effort: answers are nice to have, but only completion gates the dashboard.
      await fetch("/api/onboarding/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      }).catch(() => {});
      const completeRes = await fetch("/api/onboarding/complete", { method: "POST" });
      if (!completeRes.ok) {
        const data = await completeRes.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to complete onboarding");
      }
      router.replace("/dashboard");
    } catch {
      // Don't redirect on failure — OnboardingRedirect would bounce the user
      // straight back here, causing a redirect loop.
      setFinishError(t.onboarding.finishFailed);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-muted text-sm">{t.onboarding.loading}</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="w-full max-w-lg bg-surface-light/40 border border-surface-light rounded-2xl p-8 text-center">
          <h1 className="text-xl font-heading font-semibold text-foreground mb-3">
            {t.onboarding.somethingWentWrong}
          </h1>
          <p className="text-muted text-sm mb-8">{loadError}</p>
          <button
            onClick={() => {
              setLoading(true);
              setLoadError(null);
              setReloadKey((k) => k + 1);
            }}
            className="w-full px-4 py-3 bg-accent rounded-xl text-white font-medium hover:opacity-90 transition"
          >
            {t.onboarding.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-lg bg-surface-light/40 border border-surface-light rounded-2xl p-8">
        {!isWelcome && (
          <div className="mb-8">
            <div className="h-1.5 w-full bg-surface-light rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {interpolateMsg(t.onboarding.stepProgress, {
                step,
                total: totalSteps - 1,
              })}
            </p>
          </div>
        )}

        {isWelcome && (
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              {t.onboarding.welcome}
            </h1>
            <p className="text-muted text-sm mb-8">
              {t.onboarding.welcomeSubtitle}
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full px-4 py-3 bg-accent rounded-xl text-white font-medium hover:opacity-90 transition"
            >
              {t.onboarding.getStarted}
            </button>
          </div>
        )}

        {currentQuestion && (
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === "TEXT" && (
              <textarea
                value={(answers[currentQuestion.id] as string) ?? ""}
                onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                rows={4}
                className="w-full bg-surface border border-surface-light rounded-xl p-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
                placeholder={t.onboarding.answerPlaceholder}
              />
            )}

            {currentQuestion.type === "SELECT" && (
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 bg-surface border border-surface-light rounded-xl cursor-pointer hover:border-accent transition"
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => setAnswer(currentQuestion.id, option)}
                      className="accent-accent"
                    />
                    <span className="text-foreground text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === "MULTI_SELECT" && (
              <div className="space-y-2">
                {currentQuestion.options.map((option) => {
                  const selected = Array.isArray(answers[currentQuestion.id])
                    ? (answers[currentQuestion.id] as string[]).includes(option)
                    : false;
                  return (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-3 bg-surface border border-surface-light rounded-xl cursor-pointer hover:border-accent transition"
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleMultiOption(currentQuestion.id, option)}
                        className="accent-accent"
                      />
                      <span className="text-foreground text-sm">{option}</span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-sm text-foreground hover:border-accent transition"
              >
                {t.onboarding.back}
              </button>
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-4 py-2 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition"
              >
                {step === questions.length ? t.onboarding.continue : t.onboarding.next}
              </button>
            </div>
          </div>
        )}

        {isDone && (
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              {t.onboarding.done}
            </h1>
            <p className="text-muted text-sm mb-8">
              {t.onboarding.doneSubtitle}
            </p>
            <button
              onClick={handleFinish}
              disabled={submitting}
              className="w-full px-4 py-3 bg-accent rounded-xl text-white font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting ? t.onboarding.finishing : t.onboarding.goToDashboard}
            </button>
            {finishError && (
              <p className="text-red-400 text-sm mt-4">{finishError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
