'use client';

import { useState, useEffect, useCallback } from 'react';

type Enrollment = {
  userId: string;
  courseId: string;
  enrolledAt: string;
  expiresAt: string | null;
  progressPct: number;
  completedAt: string | null;
  user: { name: string; email: string };
  course: { title: string; slug: string };
};

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchEnrollments = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    fetch(`/api/admin/enrollments?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setEnrollments(data.enrollments || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Enrollments</h1>
      <p className="text-muted text-sm mb-8">{total} total enrollments</p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by user or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent"
        />
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center text-muted">Loading...</div>
      ) : enrollments.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted">No enrollments found.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-left border-b border-surface-light">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Enrolled</th>
                <th className="p-4 font-medium">Progress</th>
                <th className="p-4 font-medium">Completed</th>
                <th className="p-4 font-medium">Expires</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={`${e.userId}_${e.courseId}`} className="border-b border-surface-light/50 hover:bg-surface-light/20">
                  <td className="p-4">
                    <p className="text-foreground font-medium">{e.user.name || 'N/A'}</p>
                    <p className="text-muted text-xs">{e.user.email}</p>
                  </td>
                  <td className="p-4 text-foreground">{e.course.title}</td>
                  <td className="p-4 text-muted text-xs">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface-light rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${e.progressPct}%` }} />
                      </div>
                      <span className="text-muted text-xs">{e.progressPct}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted text-xs">
                    {e.completedAt ? new Date(e.completedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-4 text-muted text-xs">
                    {e.expiresAt ? new Date(e.expiresAt).toLocaleDateString() : '—'}
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
