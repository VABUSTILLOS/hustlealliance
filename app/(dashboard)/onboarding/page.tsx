"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
          setLoadError("We couldn't load your onboarding. Check your connection and try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [router, reloadKey]);

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
    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      await fetch("/api/onboarding/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      await fetch("/api/onboarding/complete", { method: "POST" });
      router.replace("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-muted text-sm">Loading…</p>
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
              Step {step} of {totalSteps - 1}
            </p>
          </div>
        )}

        {isWelcome && (
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              Welcome! Let&apos;s get you set up.
            </h1>
            <p className="text-muted text-sm mb-8">
              Answer a few quick questions so we can personalize your experience.
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full px-4 py-3 bg-accent rounded-xl text-white font-medium hover:opacity-90 transition"
            >
              Get started
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
                placeholder="Type your answer…"
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
                Back
              </button>
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-4 py-2 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition"
              >
                {step === questions.length ? "Continue" : "Next"}
              </button>
            </div>
          </div>
        )}

        {isDone && (
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              You&apos;re all set! 🎉
            </h1>
            <p className="text-muted text-sm mb-8">
              Thanks for sharing. Your dashboard is ready — let&apos;s go explore the community.
            </p>
            <button
              onClick={handleFinish}
              disabled={submitting}
              className="w-full px-4 py-3 bg-accent rounded-xl text-white font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting ? "Finishing…" : "Go to dashboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
