'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Stats = {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentEnrollments: Array<{
    id: string;
    user: { name: string; email: string };
    course: { title: string; slug: string };
    enrolledAt: string;
    progressPct: number;
  }>;
  usersByRole: Array<{ role: string; count: number }>;
  usersByTier: Array<{ tier: string; count: number }>;
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-surface-light rounded w-1/2 mb-2" />
              <div className="h-8 bg-surface-light rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-heading font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted mt-4">Failed to load stats.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'text-blue-400' },
    { label: 'Total Courses', value: stats.totalCourses.toLocaleString(), color: 'text-green-400' },
    { label: 'Enrollments', value: stats.totalEnrollments.toLocaleString(), color: 'text-purple-400' },
    { label: 'Revenue', value: `$${(stats.totalRevenue / 100).toLocaleString()}`, color: 'text-accent' },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted text-sm mt-1">Platform overview and quick stats</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="glass-card p-6">
            <p className="text-muted text-sm">{card.label}</p>
            <p className={`text-3xl font-heading font-bold mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Role & Tier breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-foreground font-heading font-bold mb-4">Users by Role</h3>
          <div className="space-y-2">
            {stats.usersByRole.map((r) => (
              <div key={r.role} className="flex justify-between items-center">
                <span className="text-muted text-sm">{r.role}</span>
                <span className="text-foreground font-mono font-bold">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-foreground font-heading font-bold mb-4">Users by Tier</h3>
          <div className="space-y-2">
            {stats.usersByTier.map((t) => (
              <div key={t.tier} className="flex justify-between items-center">
                <span className="text-muted text-sm">{t.tier}</span>
                <span className="text-foreground font-mono font-bold">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent enrollments */}
      <div className="glass-card p-6">
        <h3 className="text-foreground font-heading font-bold mb-4">Recent Enrollments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-left border-b border-surface-light">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Course</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEnrollments.map((e) => (
                <tr key={e.id} className="border-b border-surface-light/50">
                  <td className="py-3">
                    <p className="text-foreground font-medium">{e.user.name}</p>
                    <p className="text-muted text-xs">{e.user.email}</p>
                  </td>
                  <td className="py-3">
                    <Link href={`/admin/courses/${e.course.slug}`} className="text-accent hover:underline">
                      {e.course.title}
                    </Link>
                  </td>
                  <td className="py-3 text-muted">
                    {new Date(e.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface-light rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${e.progressPct}%` }}
                        />
                      </div>
                      <span className="text-muted text-xs">{e.progressPct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
