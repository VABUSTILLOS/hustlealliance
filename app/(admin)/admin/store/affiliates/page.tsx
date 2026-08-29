'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Affiliate = {
  referrerId: string;
  name: string | null;
  email: string;
  codes: string[];
  conversions: number;
  revenue: number;
  paidCents: number;
  pendingCents: number;
};

type Payout = {
  id: string;
  referrerId: string;
  referrerName: string | null;
  referrerEmail: string;
  amountCents: number;
  status: 'PENDING' | 'PAID';
  periodLabel: string;
  createdAt: string;
  paidAt: string | null;
};

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function AffiliatesAdminPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ referrerId: '', amount: '', periodLabel: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/store/affiliates');
    if (res.ok) {
      const data = await res.json();
      setAffiliates(data.affiliates);
      setPayouts(data.payouts);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const createPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/store/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerId: form.referrerId,
          amountCents: Math.round(Number(form.amount) * 100),
          periodLabel: form.periodLabel,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setForm({ referrerId: '', amount: '', periodLabel: '' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payout');
    } finally {
      setSaving(false);
    }
  };

  const markPaid = async (id: string) => {
    const res = await fetch(`/api/admin/store/payouts/${id}`, { method: 'PATCH' });
    if (res.ok) await load();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <Link href="/admin/store" className="text-muted text-xs hover:text-foreground">← Store</Link>
      <h1 className="text-2xl font-heading font-bold text-foreground mt-2 mb-6">Affiliates & payouts</h1>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <>
          <div className="rounded-2xl bg-surface overflow-hidden mb-8">
            <h2 className="px-6 pt-5 pb-3 text-sm font-semibold text-foreground">Affiliates</h2>
            {affiliates.length === 0 ? (
              <p className="px-6 pb-6 text-muted text-sm">No referral activity yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted border-b border-border/50">
                    <th className="px-6 py-2 font-medium">Referrer</th>
                    <th className="px-4 py-2 font-medium">Codes</th>
                    <th className="px-4 py-2 font-medium text-right">Conversions</th>
                    <th className="px-4 py-2 font-medium text-right">Revenue</th>
                    <th className="px-4 py-2 font-medium text-right">Paid</th>
                    <th className="px-6 py-2 font-medium text-right">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((a) => (
                    <tr key={a.referrerId} className="border-b border-border/30 last:border-0">
                      <td className="px-6 py-2.5">
                        <div className="text-foreground">{a.name ?? a.email}</div>
                        {a.name && <div className="text-muted text-xs">{a.email}</div>}
                      </td>
                      <td className="px-4 py-2.5 text-muted font-mono text-xs">{a.codes.join(', ')}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{a.conversions}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">${a.revenue.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right text-muted">{money(a.paidCents)}</td>
                      <td className="px-6 py-2.5 text-right text-amber-400">{money(a.pendingCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl bg-surface overflow-hidden">
              <h2 className="px-6 pt-5 pb-3 text-sm font-semibold text-foreground">Payout records</h2>
              {payouts.length === 0 ? (
                <p className="px-6 pb-6 text-muted text-sm">No payouts recorded yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted border-b border-border/50">
                      <th className="px-6 py-2 font-medium">Referrer</th>
                      <th className="px-4 py-2 font-medium">Period</th>
                      <th className="px-4 py-2 font-medium text-right">Amount</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                      <th className="px-6 py-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p.id} className="border-b border-border/30 last:border-0">
                        <td className="px-6 py-2.5 text-foreground">{p.referrerName ?? p.referrerEmail}</td>
                        <td className="px-4 py-2.5 text-muted">{p.periodLabel}</td>
                        <td className="px-4 py-2.5 text-right text-foreground">{money(p.amountCents)}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                            p.status === 'PAID' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-2.5 text-right">
                          {p.status === 'PENDING' && (
                            <button onClick={() => markPaid(p.id)} className="text-accent hover:underline text-xs font-medium">
                              Mark paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <form onSubmit={createPayout} className="rounded-2xl bg-surface p-6 h-fit">
              <h2 className="text-sm font-semibold text-foreground mb-4">Record payout</h2>
              <label className="block text-xs text-muted mb-1">Affiliate</label>
              <select
                value={form.referrerId}
                onChange={(e) => setForm((f) => ({ ...f, referrerId: e.target.value }))}
                required
                className="w-full mb-3 px-3 py-2 bg-surface-light border border-border/40 rounded-xl text-foreground text-sm"
              >
                <option value="">Select…</option>
                {affiliates.map((a) => (
                  <option key={a.referrerId} value={a.referrerId}>
                    {a.name ?? a.email}
                  </option>
                ))}
              </select>
              <label className="block text-xs text-muted mb-1">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                required
                className="w-full mb-3 px-3 py-2 bg-surface-light border border-border/40 rounded-xl text-foreground text-sm"
              />
              <label className="block text-xs text-muted mb-1">Period label (e.g. 2026-08)</label>
              <input
                value={form.periodLabel}
                onChange={(e) => setForm((f) => ({ ...f, periodLabel: e.target.value }))}
                required
                placeholder="2026-08"
                className="w-full mb-4 px-3 py-2 bg-surface-light border border-border/40 rounded-xl text-foreground text-sm"
              />
              {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Record payout'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
