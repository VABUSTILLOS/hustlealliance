'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import StoreAnalyticsSections from './store-analytics';
import SourcesSection from './sources-section';
import LineChart from './components/line-chart';
import SvgBarChart from './components/bar-chart';
import StatCard from './components/stat-card';
import Funnel from './components/funnel';

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

// ─── New analytics sections (growth, retention, engagement, revenue, funnel) ───

type GrowthData = {
  series: { date: string; count: number }[];
  cumulative: { date: string; total: number }[];
  totals: {
    totalMembers: number;
    newThisWeek: number;
    byTier: { tier: string; count: number }[];
  };
};

type RetentionData = {
  activitySource: string;
  series: { date: string; dau: number; wau: number; mau: number }[];
  cohorts: { signupWeek: string; cohortSize: number; retention: number[] }[] | null;
};

type EngagementData = {
  series: {
    date: string;
    posts: number;
    comments: number;
    likes: number;
    messages: number;
    lessonCompletions: number;
  }[];
  totals: { posts: number; comments: number; likes: number; messages: number; lessonCompletions: number };
  deltas?: { posts: number | null; comments: number | null; likes: number | null; messages: number | null; lessonCompletions: number | null };
};

type RevenueData = {
  series: { date: string; amount: number }[];
  byType: { type: string; amount: number }[];
  topProducts: { title: string; revenue: number; units: number }[];
  totals: { total: number };
  deltas?: { total: number | null };
};

function deltaLabel(value: number | null | undefined): string | undefined {
  if (value === null || value === undefined) return undefined;
  return `${value >= 0 ? '▲' : '▼'} ${Math.abs(value)}% vs prev period`;
}

type FunnelData = {
  steps: { label: string; count: number }[];
};

type CommunityContentData = {
  totals: { posts: number; comments: number; likes: number; shares: number; bookmarks: number };
  topPosts: Array<{ id: string; text: string; author: string; avatar?: string | null; space?: string | null; createdAt: string; likes: number; comments: number; shares: number; bookmarks: number }>;
  topHashtags: Array<{ name: string; postCount: number }>;
  referralFunnel: { total: number; pending: number; converted: number; rewarded: number };
};

const RANGE_OPTIONS = [30, 90, 180] as const;

function useAnalyticsFetch<T>(endpoint: string, days: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(false);
      try {
        const r = await fetch(`${endpoint}?days=${days}`);
        if (!r.ok) throw new Error('failed');
        const json = await r.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [endpoint, days]);

  return { data, loading, error };
}

function CommunityAnalyticsSections({ range }: { range: (typeof RANGE_OPTIONS)[number] }) {
  const growth = useAnalyticsFetch<GrowthData>('/api/admin/analytics/growth', range);
  const retention = useAnalyticsFetch<RetentionData>('/api/admin/analytics/retention', range);
  const engagement = useAnalyticsFetch<EngagementData>('/api/admin/analytics/engagement', range);
  const revenue = useAnalyticsFetch<RevenueData>('/api/admin/analytics/revenue', range);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [funnelError, setFunnelError] = useState(false);
  const community = useAnalyticsFetch<CommunityContentData>('/api/admin/analytics/community', range);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/analytics/funnel')
      .then((r) => {
        if (!r.ok) throw new Error('failed');
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setFunnel(json);
      })
      .catch(() => {
        if (!cancelled) setFunnelError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8 mb-12">
      {/* Growth */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Growth</h2>
        {growth.loading && <p className="text-sm text-muted">Loading growth data…</p>}
        {growth.error && <p className="text-sm text-muted">Failed to load growth data.</p>}
        {growth.data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total members" value={growth.data.totals.totalMembers} />
              <StatCard label="New this week" value={growth.data.totals.newThisWeek} />
              {growth.data.totals.byTier.map((t) => (
                <StatCard key={t.tier} label={`${t.tier} members`} value={t.count} />
              ))}
            </div>
            <p className="text-sm text-muted mb-3">Daily new signups (last {range} days)</p>
            <LineChart
              data={growth.data.series.map((s) => ({ label: s.date.slice(5), value: s.count }))}
              color="#22C55E"
            />
          </>
        )}
      </div>

      {/* Retention */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-1">Retention</h2>
        {retention.data && (
          <p className="text-xs text-muted mb-4">Activity source: {retention.data.activitySource}</p>
        )}
        {retention.loading && <p className="text-sm text-muted">Loading retention data…</p>}
        {retention.error && <p className="text-sm text-muted">Failed to load retention data.</p>}
        {retention.data && (
          <>
            <p className="text-sm text-muted mb-3">Weekly active users (WAU) — {range} day window</p>
            <LineChart
              data={retention.data.series.map((s) => ({ label: s.date.slice(5), value: s.wau }))}
              color="#3B82F6"
            />
            {retention.data.cohorts && (
              <div className="mt-6 overflow-x-auto">
                <p className="text-sm text-muted mb-2">4-week cohort retention</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted border-b border-surface-light/50">
                      <th className="py-2 pr-4 font-normal">Signup week</th>
                      <th className="py-2 pr-4 font-normal">Cohort size</th>
                      <th className="py-2 pr-4 font-normal">Wk 1</th>
                      <th className="py-2 pr-4 font-normal">Wk 2</th>
                      <th className="py-2 pr-4 font-normal">Wk 3</th>
                      <th className="py-2 font-normal">Wk 4</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retention.data.cohorts.map((c) => (
                      <tr key={c.signupWeek} className="border-b border-surface-light/30 last:border-0">
                        <td className="py-2 pr-4 text-foreground">{c.signupWeek}</td>
                        <td className="py-2 pr-4 text-muted font-mono">{c.cohortSize}</td>
                        {c.retention.map((r, i) => (
                          <td key={i} className="py-2 pr-4 text-muted font-mono">
                            {r}%
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Engagement */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Engagement</h2>
        {engagement.loading && <p className="text-sm text-muted">Loading engagement data…</p>}
        {engagement.error && <p className="text-sm text-muted">Failed to load engagement data.</p>}
        {engagement.data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatCard label="Posts" value={engagement.data.totals.posts} delta={deltaLabel(engagement.data.deltas?.posts)} />
              <StatCard label="Comments" value={engagement.data.totals.comments} delta={deltaLabel(engagement.data.deltas?.comments)} />
              <StatCard label="Likes" value={engagement.data.totals.likes} delta={deltaLabel(engagement.data.deltas?.likes)} />
              <StatCard label="Messages" value={engagement.data.totals.messages} delta={deltaLabel(engagement.data.deltas?.messages)} />
              <StatCard label="Lesson completions" value={engagement.data.totals.lessonCompletions} delta={deltaLabel(engagement.data.deltas?.lessonCompletions)} />
            </div>
            <p className="text-sm text-muted mb-3">Weekly posts &amp; comments</p>
            <SvgBarChart
              data={engagement.data.series.map((s) => ({ label: s.date.slice(5), value: s.posts + s.comments }))}
              color="#A855F7"
            />
          </>
        )}
      </div>

      {/* Revenue */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Revenue</h2>
        {revenue.loading && <p className="text-sm text-muted">Loading revenue data…</p>}
        {revenue.error && <p className="text-sm text-muted">Failed to load revenue data.</p>}
        {revenue.data && (
          <>
            <div className="mb-6">
              <StatCard label="Total revenue" value={`$${revenue.data.totals.total.toFixed(2)}`} delta={deltaLabel(revenue.data.deltas?.total)} />
            </div>
            <p className="text-sm text-muted mb-3">Daily revenue (last {range} days)</p>
            <LineChart
              data={revenue.data.series.map((s) => ({ label: s.date.slice(5), value: s.amount }))}
              color="#FF3B30"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div>
                <p className="text-sm text-muted mb-3">Revenue by product type</p>
                <SvgBarChart
                  data={revenue.data.byType.map((t) => ({ label: t.type, value: t.amount }))}
                  color="#F59E0B"
                />
              </div>
              <div>
                <p className="text-sm text-muted mb-3">Top 5 products by revenue</p>
                {revenue.data.topProducts.length === 0 ? (
                  <p className="text-sm text-muted">No product sales yet.</p>
                ) : (
                  <div className="space-y-3">
                    {revenue.data.topProducts.map((p, i) => (
                      <div key={p.title} className="flex items-center justify-between py-2 border-b border-surface-light/50 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-muted font-mono text-sm w-6 shrink-0">#{i + 1}</span>
                          <span className="text-foreground text-sm truncate">{p.title}</span>
                        </div>
                        <span className="text-muted text-sm font-mono shrink-0">
                          ${p.revenue.toFixed(2)} · {p.units} units
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Funnel */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Conversion Funnel</h2>
        {funnelError && <p className="text-sm text-muted">Failed to load funnel data.</p>}
        {!funnel && !funnelError && <p className="text-sm text-muted">Loading funnel data…</p>}
        {funnel && <Funnel steps={funnel.steps} />}
      </div>

      {/* Community content */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Community Content</h2>
        {community.loading && <p className="text-sm text-muted">Loading community analytics…</p>}
        {community.error && <p className="text-sm text-muted">Failed to load community analytics.</p>}
        {community.data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatCard label="Posts" value={community.data.totals.posts} />
              <StatCard label="Comments" value={community.data.totals.comments} />
              <StatCard label="Likes" value={community.data.totals.likes} />
              <StatCard label="Shares" value={community.data.totals.shares} />
              <StatCard label="Bookmarks" value={community.data.totals.bookmarks} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted mb-3">Top posts by engagement</p>
                {community.data.topPosts.length === 0 ? (
                  <p className="text-sm text-muted">No community posts in this window.</p>
                ) : (
                  <div className="space-y-3">
                    {community.data.topPosts.map((p, i) => (
                      <div key={p.id} className="py-2 border-b border-surface-light/50 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-muted font-mono text-sm w-6 shrink-0">#{i + 1}</span>
                          {p.avatar ? (
                            <img src={p.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-surface-light" />
                          )}
                          <span className="text-foreground text-sm font-medium">{p.author}</span>
                          {p.space && <span className="text-xs text-muted bg-surface-light/50 rounded-full px-2 py-0.5">#{p.space}</span>}
                        </div>
                        <p className="text-sm text-muted line-clamp-2 pl-8">{p.text}</p>
                        <p className="text-xs text-muted font-mono pl-8 mt-1">
                          ♥ {p.likes} · 💬 {p.comments} · ↗ {p.shares} · 🔖 {p.bookmarks}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted mb-3">Top hashtags</p>
                  {community.data.topHashtags.length === 0 ? (
                    <p className="text-sm text-muted">No hashtags yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {community.data.topHashtags.map((h) => (
                        <span key={h.name} className="text-sm text-foreground bg-surface-light/50 rounded-full px-3 py-1">
                          #{h.name} <span className="text-muted font-mono">{h.postCount}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted mb-3">Referral funnel</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Total referrals</span>
                      <span className="text-muted font-mono">{community.data.referralFunnel.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Pending</span>
                      <span className="text-muted font-mono">{community.data.referralFunnel.pending}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Converted</span>
                      <span className="text-muted font-mono">{community.data.referralFunnel.converted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Rewarded</span>
                      <span className="text-muted font-mono">{community.data.referralFunnel.rewarded}</span>
                    </div>
                    {community.data.referralFunnel.total > 0 && (
                      <div className="mt-2 h-2 bg-surface-light rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${(community.data.referralFunnel.pending / community.data.referralFunnel.total) * 100}%` }}
                          title="Pending"
                        />
                        <div
                          className="h-full bg-green-400"
                          style={{ width: `${(community.data.referralFunnel.converted / community.data.referralFunnel.total) * 100}%` }}
                          title="Converted"
                        />
                        <div
                          className="h-full bg-blue-400"
                          style={{ width: `${(community.data.referralFunnel.rewarded / community.data.referralFunnel.total) * 100}%` }}
                          title="Rewarded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>(90);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-muted">{t.admin.analytics.loading}</div>;
  if (!data) return <div className="p-8 text-muted">{t.admin.analytics.failedLoad}</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-heading font-bold text-foreground">{t.admin.analytics.title}</h1>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex gap-2 mr-2">
            {(['growth', 'engagement', 'revenue'] as const).map((type) => (
              <a
                key={type}
                href={`/api/admin/analytics/export?type=${type}&days=${range}`}
                className="px-3 py-1 rounded-md text-sm border border-surface-light text-muted hover:text-foreground transition-colors capitalize"
              >
                ⬇ {type} CSV
              </a>
            ))}
          </div>
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                range === r
                  ? 'bg-red-500/20 border-red-500 text-foreground'
                  : 'border-surface-light text-muted hover:text-foreground'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <CommunityAnalyticsSections range={range} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enrollments chart */}
        <div className="glass-card p-6">
          <BarChart data={data.enrollmentsByMonth} dataKey="count" color="#3B82F6" label={t.admin.analytics.enrollmentsPerMonth} />
        </div>

        {/* Completions chart */}
        <div className="glass-card p-6">
          <BarChart data={data.completionsByMonth} dataKey="count" color="#22C55E" label={t.admin.analytics.completionsPerMonth} />
        </div>

        {/* Revenue chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <BarChart data={data.revenueByMonth} dataKey="amount" color="#FF3B30" label={t.admin.analytics.revenuePerMonth} />
        </div>
      </div>

      {/* Top courses */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-foreground font-heading font-bold mb-4">{t.admin.analytics.topCourses}</h3>
        <div className="space-y-3">
          {data.topCourses.slice(0, 5).map((c, i) => (
            <div key={c.title} className="flex items-center justify-between py-2 border-b border-surface-light/50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-muted font-mono text-sm w-6">#{i + 1}</span>
                <span className="text-foreground text-sm">{c.title}</span>
              </div>
              <span className="text-muted text-sm font-mono">{t.admin.analytics.enrolled.replace('{count}', String(c.enrollments))}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Completion rates */}
      <div className="glass-card p-6">
        <h3 className="text-foreground font-heading font-bold mb-4">{t.admin.analytics.completionRates}</h3>
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

      <StoreAnalyticsSections />
      <SourcesSection />
    </div>
  );
}
