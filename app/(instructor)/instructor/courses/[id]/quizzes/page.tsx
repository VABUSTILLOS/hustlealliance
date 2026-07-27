'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

type QuizSummary = {
  quizId: string;
  lessonTitle: string;
  moduleTitle: string;
  totalAttempts: number;
  avgScore: number;
  passRate: number;
  passCount: number;
  failCount: number;
};

type StudentAttempt = {
  attemptId: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  passed: boolean;
  submittedAt: string;
};

export default function CourseQuizzesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<{ quizzes: QuizSummary[]; attempts: StudentAttempt[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/instructor/courses/${id}/quizzes`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-muted">Loading...</div>;
  if (!data) return <div className="p-8 text-muted">Failed to load quiz data.</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/instructor/courses/${id}`} className="text-muted hover:text-foreground">← Back</Link>
        <h1 className="text-2xl font-heading font-bold text-foreground">Quiz Results</h1>
      </div>

      {/* Quiz summaries */}
      {data.quizzes.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted">No quizzes in this course.</div>
      ) : (
        <div className="space-y-6">
          {data.quizzes.map((q) => (
            <div key={q.quizId} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-foreground font-heading font-bold">{q.lessonTitle}</h3>
                  <p className="text-muted text-xs">{q.moduleTitle}</p>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-2xl font-heading font-bold text-blue-400">{q.avgScore}%</p>
                    <p className="text-muted text-[10px]">Avg Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-green-400">{q.passRate}%</p>
                    <p className="text-muted text-[10px]">Pass Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-foreground">{q.totalAttempts}</p>
                    <p className="text-muted text-[10px]">Attempts</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-green-400">{q.passCount} passed</span>
                <span className="text-red-400">{q.failCount} failed</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent attempts */}
      {data.attempts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-heading font-bold text-foreground mb-4">Recent Attempts</h2>
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-left border-b border-surface-light">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Score</th>
                  <th className="p-4 font-medium">Result</th>
                  <th className="p-4 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {data.attempts.slice(0, 20).map((a) => (
                  <tr key={a.attemptId} className="border-b border-surface-light/50">
                    <td className="p-4">
                      <p className="text-foreground font-medium">{a.userName}</p>
                      <p className="text-muted text-xs">{a.userEmail}</p>
                    </td>
                    <td className="p-4 text-muted font-mono">{a.score}%</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.passed ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {a.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="p-4 text-muted text-xs">{new Date(a.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
