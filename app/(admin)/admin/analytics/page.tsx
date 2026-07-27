'use client';

import { useState, useEffect } from 'react';

type ChartDataPoint = { month: string; count?: number; amount?: number };
type Analytics = {
  enrollmentsByMonth: ChartDataPoint[];
  completionsByMonth: ChartDataPoint[];
  revenueByMonth: ChartDataPoint[];
  topCourses: Array<{ title: string; enrollments: number; completions: number }>;
  courseCompletionRates: Array<{ title: string; enrolled: number; completed: number; rate: number }>;
};

// Simple SVG bar chart component
function BarChart({ data, dataKey, color, label }: { data: ChartDataPoint[]; dataKey: 'count' | 'amount'; color: string; label: string }) {
  const values = data.map((d) => d[dataKey] || 0);
  const maxVal = Math.max(...values, 1);
  const chartH = 160;
  const barW = Math.max(6, Math.min(30, 500 / data.length));

  return (
    <div>
      <p className="text-sm text-muted mb-3">{label}</p>
      <svg width="100%" height={chartH + 30} viewBox={`0 0 600 ${chartH + 30}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <g key={pct}>
            <line x1={40} y1={chartH - pct * chartH} x2={580} y2={chartH - pct * chartH} stroke="#1C1C1E" strokeWidth={0.5} />
            <text x={34} y={chartH - pct * chartH + 4} fill="#8A8A8A" fontSize={10} textAnchor="end">
              {dataKey === 'amount' ? `$${Math.round(maxVal * pct)}` : Math.round(maxVal * pct)}
            </text>
          </g>
        ))}
        {/* Bars */}
        {data.map((d, i) => {
          const val = d[dataKey] || 0;
          const h = (val / maxVal) * chartH;
          const x = 50 + i * ((540) / data.length);
          return (
            <g key={i}>
              <rect x={x} y={chartH - h} width={barW} height={h} rx={2} fill={color} opacity={0.8} />
              <text x={x + barW / 2} y={chartH + 16} fill="#8A8A8A" fontSize={8} textAnchor="middle">
                {d.month.slice(5)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-muted">Loading analytics...</div>;
  if (!data) return <div className="p-8 text-muted">Failed to load analytics.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-8">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enrollments chart */}
        <div className="glass-card p-6">
          <BarChart data={data.enrollmentsByMonth} dataKey="count" color="#3B82F6" label="Enrollments per Month" />
        </div>

        {/* Completions chart */}
        <div className="glass-card p-6">
          <BarChart data={data.completionsByMonth} dataKey="count" color="#22C55E" label="Completions per Month" />
        </div>

        {/* Revenue chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <BarChart data={data.revenueByMonth} dataKey="amount" color="#FF3B30" label="Revenue per Month (USD)" />
        </div>
      </div>

      {/* Top courses */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-foreground font-heading font-bold mb-4">Top Courses by Enrollment</h3>
        <div className="space-y-3">
          {data.topCourses.slice(0, 5).map((c, i) => (
            <div key={c.title} className="flex items-center justify-between py-2 border-b border-surface-light/50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-muted font-mono text-sm w-6">#{i + 1}</span>
                <span className="text-foreground text-sm">{c.title}</span>
              </div>
              <span className="text-muted text-sm font-mono">{c.enrollments} enrolled</span>
            </div>
          ))}
        </div>
      </div>

      {/* Completion rates */}
      <div className="glass-card p-6">
        <h3 className="text-foreground font-heading font-bold mb-4">Course Completion Rates</h3>
        <div className="space-y-3">
          {data.courseCompletionRates.slice(0, 10).map((c) => (
            <div key={c.title} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{c.title}</span>
                <span className="text-muted">{c.rate}% ({c.completed}/{c.enrolled})</span>
              </div>
              <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: `${c.rate}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
