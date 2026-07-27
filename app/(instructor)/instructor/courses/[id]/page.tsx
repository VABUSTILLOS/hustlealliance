'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

type Student = {
  userId: string;
  userName: string;
  userEmail: string;
  avatar: string | null;
  enrolledAt: string;
  progressPct: number;
  completedAt: string | null;
  lastActiveAt: string | null;
  completedLessons: number;
  totalLessons: number;
};

export default function CourseStudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<{ course: { title: string }; students: Student[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/instructor/courses/${id}/students`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-muted">Loading...</div>;
  if (!data) return <div className="p-8 text-muted">Course not found.</div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/instructor" className="text-muted hover:text-foreground">← Back</Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{data.course.title}</h1>
          <p className="text-muted text-sm">{data.students.length} students enrolled</p>
        </div>
      </div>

      {data.students.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted">No students enrolled yet.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-left border-b border-surface-light">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Enrolled</th>
                <th className="p-4 font-medium">Progress</th>
                <th className="p-4 font-medium">Lessons</th>
                <th className="p-4 font-medium">Last Active</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) => (
                <tr key={s.userId} className="border-b border-surface-light/50 hover:bg-surface-light/20">
                  <td className="p-4">
                    <Link href={`/instructor/courses/${id}/students/${s.userId}`} className="text-foreground font-medium hover:text-accent">
                      {s.userName}
                    </Link>
                    <p className="text-muted text-xs">{s.userEmail}</p>
                  </td>
                  <td className="p-4 text-muted text-xs">{new Date(s.enrolledAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface-light rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${s.progressPct}%` }} />
                      </div>
                      <span className="text-muted text-xs">{s.progressPct}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted">{s.completedLessons}/{s.totalLessons}</td>
                  <td className="p-4 text-muted text-xs">{s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleDateString() : '—'}</td>
                  <td className="p-4">
                    {s.completedAt ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-green-400 bg-green-400/10">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-blue-400 bg-blue-400/10">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
