'use client';

import { useEffect, useState } from 'react';

type Referral = {
  id: string;
  code: string;
  status: 'PENDING' | 'CONVERTED' | 'REWARDED';
  createdAt: string;
  convertedAt: string | null;
  referrer: { name: string; email: string };
  referee: { name: string; email: string } | null;
  rewardCoupon: { code: string; amount: number; discountType: string } | null;
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-surface-light text-muted',
  CONVERTED: 'bg-blue-500/20 text-blue-400',
  REWARDED: 'bg-green-500/20 text-green-400',
};

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<{ total: number; pending: number; converted: number; rewarded: number; conversionRate: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/referrals')
      .then((r) => r.json())
      .then((data) => {
        setReferrals(data.referrals || []);
        setStats(data.stats || null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Referrals</h1>
      <p className="text-muted text-sm mb-8">Track referral conversions and rewards.</p>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Pending', value: stats.pending },
            { label: 'Converted', value: stats.converted + stats.rewarded },
            { label: 'Conversion rate', value: `${stats.conversionRate}%` },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-surface-light rounded-2xl p-4">
              <p className="text-muted text-xs mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : referrals.length === 0 ? (
        <p className="text-muted text-sm">No referrals yet.</p>
      ) : (
        <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-light text-left text-muted">
                <th className="p-4">Code</th>
                <th className="p-4">Referrer</th>
                <th className="p-4">Referee</th>
                <th className="p-4">Status</th>
                <th className="p-4">Reward</th>
                <th className="p-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.id} className="border-b border-surface-light last:border-0">
                  <td className="p-4 font-mono text-foreground">{r.code}</td>
                  <td className="p-4 text-foreground">{r.referrer.name}<p className="text-muted text-xs">{r.referrer.email}</p></td>
                  <td className="p-4 text-foreground">{r.referee ? r.referee.name : '—'}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span></td>
                  <td className="p-4 text-muted text-xs">{r.rewardCoupon ? `${r.rewardCoupon.code} (${r.rewardCoupon.amount}${r.rewardCoupon.discountType === 'PERCENT' ? '%' : ''})` : '—'}</td>
                  <td className="p-4 text-muted text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
