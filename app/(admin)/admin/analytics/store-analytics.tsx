'use client';

import { useCallback, useEffect, useState } from 'react';

type RevenuePoint = { date: string; revenue: number; orders: number };
type ProductRow = { productId: string; title: string; slug: string; revenue: number; units: number };
type CouponRow = {
  couponId: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED' | null;
  amount: number;
  redemptions: number;
  maxUses: number | null;
  discountedRevenue: number;
};
type Funnel = { publishedLandingPages: number; ordersStarted: number; paidOrders: number; note: string };
type CampaignRow = {
  campaignId: string;
  name: string;
  status: string;
  sentAt: string | null;
  total: number;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
};
type ReferralFunnel = { referred: number; converted: number; rewarded: number };

type StoreAnalytics = {
  revenue: RevenuePoint[];
  products: ProductRow[];
  coupons: CouponRow[];
  funnel: Funnel;
  campaigns: CampaignRow[];
  referrals: ReferralFunnel;
};

const RANGE_OPTIONS = [7, 30, 90] as const;

function LineChart({ data }: { data: RevenuePoint[] }) {
  const chartH = 160;
  const chartW = 600;
  const values = data.map((d) => d.revenue);
  const maxVal = Math.max(...values, 1);

  if (data.length === 0) {
    return <p className="text-sm text-muted">No revenue data yet for this range.</p>;
  }

  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * (chartW - 60) + 50 : chartW / 2;
    const y = chartH - (d.revenue / maxVal) * chartH;
    return { x, y, d };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width="100%" height={chartH + 30} viewBox={`0 0 ${chartW} ${chartH + 30}`} preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <g key={pct}>
          <line x1={40} y1={chartH - pct * chartH} x2={chartW - 20} y2={chartH - pct * chartH} stroke="#1C1C1E" strokeWidth={0.5} />
          <text x={34} y={chartH - pct * chartH + 4} fill="#8A8A8A" fontSize={10} textAnchor="end">
            ${Math.round(maxVal * pct)}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke="#FF3B30" strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#FF3B30" />
      ))}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={chartH + 16} fill="#8A8A8A" fontSize={8} textAnchor="middle">
          {p.d.date.slice(5)}
        </text>
      ))}
    </svg>
  );
}

function FunnelBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="text-muted">{value}</span>
      </div>
      <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function StoreAnalyticsSections() {
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>(30);
  const [data, setData] = useState<StoreAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAnalytics = useCallback(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/admin/analytics/store?section=all&range=${range}`)
      .then((r) => {
        if (!r.ok) throw new Error('failed');
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Store &amp; Growth Analytics</h2>
        <div className="flex gap-2">
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

      {loading && <div className="text-muted text-sm mb-6">Loading store analytics...</div>}
      {error && <div className="text-muted text-sm mb-6">Failed to load store analytics.</div>}

      {data && (
        <>
          {/* Revenue over time */}
          <div className="glass-card p-6 mb-6">
            <p className="text-sm text-muted mb-3">Revenue over time (last {range} days)</p>
            <LineChart data={data.revenue} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sales by product */}
            <div className="glass-card p-6">
              <h3 className="text-foreground font-heading font-bold mb-4">Sales by Product</h3>
              {data.products.length === 0 ? (
                <p className="text-sm text-muted">No product sales yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.products.slice(0, 10).map((p, i) => (
                    <div key={p.productId} className="flex items-center justify-between py-2 border-b border-surface-light/50 last:border-0">
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

            {/* Coupon usage */}
            <div className="glass-card p-6">
              <h3 className="text-foreground font-heading font-bold mb-4">Coupon Usage</h3>
              {data.coupons.length === 0 ? (
                <p className="text-sm text-muted">No coupon redemptions yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.coupons.slice(0, 10).map((c) => (
                    <div key={c.couponId} className="flex items-center justify-between py-2 border-b border-surface-light/50 last:border-0">
                      <div className="min-w-0">
                        <span className="text-foreground text-sm font-mono">{c.code}</span>
                        <span className="text-muted text-xs ml-2">
                          {c.discountType === 'PERCENT' ? `${c.amount}%` : `$${c.amount}`} off
                        </span>
                      </div>
                      <span className="text-muted text-sm font-mono shrink-0">
                        {c.redemptions} uses · ${c.discountedRevenue.toFixed(2)} rev
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Conversion funnel */}
            <div className="glass-card p-6">
              <h3 className="text-foreground font-heading font-bold mb-1">Conversion Funnel</h3>
              <p className="text-xs text-muted mb-4">{data.funnel.note}</p>
              <div className="space-y-4">
                <FunnelBar
                  label="Published landing pages"
                  value={data.funnel.publishedLandingPages}
                  max={Math.max(data.funnel.publishedLandingPages, data.funnel.ordersStarted, data.funnel.paidOrders, 1)}
                />
                <FunnelBar
                  label="Orders started"
                  value={data.funnel.ordersStarted}
                  max={Math.max(data.funnel.publishedLandingPages, data.funnel.ordersStarted, data.funnel.paidOrders, 1)}
                />
                <FunnelBar
                  label="Paid orders"
                  value={data.funnel.paidOrders}
                  max={Math.max(data.funnel.publishedLandingPages, data.funnel.ordersStarted, data.funnel.paidOrders, 1)}
                />
              </div>
            </div>

            {/* Referral funnel */}
            <div className="glass-card p-6">
              <h3 className="text-foreground font-heading font-bold mb-4">Referral Funnel</h3>
              <div className="space-y-4">
                <FunnelBar
                  label="Referred"
                  value={data.referrals.referred}
                  max={Math.max(data.referrals.referred, 1)}
                />
                <FunnelBar
                  label="Converted"
                  value={data.referrals.converted}
                  max={Math.max(data.referrals.referred, 1)}
                />
                <FunnelBar
                  label="Rewarded"
                  value={data.referrals.rewarded}
                  max={Math.max(data.referrals.referred, 1)}
                />
              </div>
            </div>
          </div>

          {/* Campaign performance */}
          <div className="glass-card p-6">
            <h3 className="text-foreground font-heading font-bold mb-4">Campaign Performance</h3>
            {data.campaigns.length === 0 ? (
              <p className="text-sm text-muted">No email campaigns yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted border-b border-surface-light/50">
                      <th className="py-2 pr-4 font-normal">Campaign</th>
                      <th className="py-2 pr-4 font-normal">Status</th>
                      <th className="py-2 pr-4 font-normal">Sent</th>
                      <th className="py-2 pr-4 font-normal">Opened</th>
                      <th className="py-2 pr-4 font-normal">Clicked</th>
                      <th className="py-2 pr-4 font-normal">Bounced</th>
                      <th className="py-2 pr-4 font-normal">Open Rate</th>
                      <th className="py-2 pr-4 font-normal">Click Rate</th>
                      <th className="py-2 font-normal">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.campaigns.map((c) => (
                      <tr key={c.campaignId} className="border-b border-surface-light/30 last:border-0">
                        <td className="py-2 pr-4 text-foreground truncate max-w-[200px]">{c.name}</td>
                        <td className="py-2 pr-4 text-muted">{c.status}</td>
                        <td className="py-2 pr-4 text-muted font-mono">{c.sent}</td>
                        <td className="py-2 pr-4 text-muted font-mono">{c.opened}</td>
                        <td className="py-2 pr-4 text-muted font-mono">{c.clicked}</td>
                        <td className="py-2 pr-4 text-muted font-mono">{c.bounced}</td>
                        <td className="py-2 pr-4 text-muted font-mono">{c.openRate}%</td>
                        <td className="py-2 pr-4 text-muted font-mono">{c.clickRate}%</td>
                        <td className="py-2 text-muted font-mono">{c.bounceRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
