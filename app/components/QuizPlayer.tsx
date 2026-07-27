'use client';

import { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';

// ─── Types ──────────────────────────────────────────────────────

interface QuizAnswer {
  id: string;
  answerText: string;
  sortOrder: number;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  sortOrder: number;
  explanation?: string | null;
  answers: QuizAnswer[];
}

export interface QuizData {
  id: string;
  title?: string | null;
  passingScore: number;
  timeLimitMinutes?: number | null;
  randomizeOrder: boolean;
  maxAttempts?: number | null;
  questions: QuizQuestion[];
  _count: { questions: number };
}

interface SubmissionResult {
  attempt: {
    id: string;
    score: number;
    passed: boolean;
    answers: Record<string, string | string[]>;
  };
}

interface QuizPlayerProps {
  quiz: QuizData;
  onComplete?: (passed: boolean, score: number) => void;
}

// ─── Component ──────────────────────────────────────────────────

export default function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
  const { t } = useTranslation();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timerStart] = useState(Date.now());

  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[currentIdx];

  // Handle answer selection
  const selectAnswer = useCallback(
    (questionId: string, answerId: string, multiple: boolean) => {
      setSelectedAnswers((prev) => {
        if (multiple) {
          const existing = (prev[questionId] as string[]) || [];
          const updated = existing.includes(answerId)
            ? existing.filter((id) => id !== answerId)
            : [...existing, answerId];
          return { ...prev, [questionId]: updated };
        }
        return { ...prev, [questionId]: answerId };
      });
    },
    []
  );

  const isMultipleCorrect = (question: QuizQuestion) => {
    // TRUE_FALSE and SHORT_ANSWER are single-select; MULTIPLE_CHOICE may need multi
    if (question.questionType === 'TRUE_FALSE' || question.questionType === 'SHORT_ANSWER') return false;
    return question.answers.filter((a) => a.answerText.includes('correct') || false).length > 1;
  };

  const hasSelected = question
    ? selectedAnswers[question.id] !== undefined &&
      (Array.isArray(selectedAnswers[question.id])
        ? (selectedAnswers[question.id] as string[]).length > 0
        : true)
    : false;

  // Submit quiz
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit quiz');
      }

      const data: SubmissionResult = await res.json();
      setResult(data);
      setSubmitted(true);
      onComplete?.(data.attempt.passed, data.attempt.score);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!quiz.timeLimitMinutes || submitted) return;
    const totalSeconds = quiz.timeLimitMinutes * 60;
    const elapsed = Math.floor((Date.now() - timerStart) / 1000);
    const remaining = Math.max(0, totalSeconds - elapsed);
    setTimeLeft(remaining);
    if (remaining <= 0) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz.timeLimitMinutes, submitted, timerStart]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Results view
  if (submitted && result) {
    const { attempt } = result;
    return (
      <div className="bg-surface border border-surface-light rounded-2xl p-8 text-center space-y-6 max-w-lg mx-auto">
        <span className="text-5xl block">{attempt.passed ? '🎉' : '📚'}</span>
        <h2 className="font-display text-2xl text-foreground uppercase">
          {attempt.passed ? 'Quiz Passed!' : 'Quiz Completed'}
        </h2>
        <div className="text-4xl font-heading font-bold text-accent">{Math.round(attempt.score)}%</div>
        <p className="text-foreground-dim text-sm">
          {attempt.passed
            ? 'Congratulations! You passed the quiz.'
            : 'Keep studying and try again. You can do it!'}
        </p>
        <p className="text-foreground-muted text-xs">
          Passing score: {quiz.passingScore}%
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-light">
        <h3 className="font-heading font-bold text-sm text-foreground uppercase">
          {quiz.title || 'Quiz'}
        </h3>
        <div className="flex items-center gap-3 text-xs text-foreground-dim">
          <span>
            {currentIdx + 1} / {totalQuestions}
          </span>
          {timeLeft !== null && (
            <span className={clsx('font-mono', timeLeft < 60 && 'text-accent animate-pulse')}>
              ⏱ {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-surface-light">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Questions */}
      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-sm text-accent">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-heading font-bold text-foreground mb-4">{question.questionText}</p>

            <div className="space-y-2">
              {question.answers.map((answer) => {
                const selected = Array.isArray(selectedAnswers[question.id])
                  ? (selectedAnswers[question.id] as string[]).includes(answer.id)
                  : selectedAnswers[question.id] === answer.id;

                return (
                  <button
                    key={answer.id}
                    onClick={() =>
                      selectAnswer(question.id, answer.id, isMultipleCorrect(question))
                    }
                    className={clsx(
                      'w-full text-left px-4 py-3 rounded-xl border transition-all text-sm',
                      selected
                        ? 'border-accent bg-accent/10 text-foreground'
                        : 'border-surface-light bg-white/5 text-foreground-dim hover:border-foreground-dim/30'
                    )}
                  >
                    {isMultipleCorrect(question) ? (
                      <span className="flex items-center gap-3">
                        <span
                          className={clsx(
                            'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                            selected ? 'border-accent bg-accent' : 'border-surface-light'
                          )}
                        >
                          {selected && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        {answer.answerText}
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <span
                          className={clsx(
                            'w-4 h-4 rounded-full border-2 shrink-0 transition-all',
                            selected ? 'border-accent' : 'border-surface-light',
                            selected && 'bg-accent shadow-[0_0_8px_rgba(255,59,48,0.4)]'
                          )}
                        />
                        {answer.answerText}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-surface-light">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-xl border border-surface-light text-sm text-foreground-dim disabled:opacity-30 disabled:cursor-not-allowed hover:border-foreground-dim/30 transition-colors"
        >
          ← Previous
        </button>

        {currentIdx < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="px-4 py-2 rounded-xl bg-accent text-foreground text-sm font-heading font-bold hover:bg-accent-glow transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={clsx(
              'px-6 py-2 rounded-xl text-sm font-heading font-bold transition-all',
              submitting
                ? 'bg-surface-light text-foreground-dim cursor-wait'
                : 'bg-emerald-500 text-foreground hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            )}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
