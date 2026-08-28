'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  amount: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  product: { id: string; title: string } | null;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCoupons = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    fetch(`/api/admin/coupons?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCoupons(data.coupons || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, [search]);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
    fetchCoupons();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/store" className="text-xs text-muted hover:text-foreground mb-1 inline-block">
            ← Back to Store
          </Link>
          <h1 className="text-2xl font-heading font-bold text-foreground">Coupons</h1>
          <p className="text-muted text-sm mt-1">{total} coupon{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/store/coupons/new"
          className="px-4 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          New Coupon
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search coupons…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent"
        />
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center text-muted">Loading…</div>
      ) : coupons.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted">No coupons found.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-light text-left text-muted">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Scope</th>
                <th className="px-4 py-3 font-medium">Uses</th>
                <th className="px-4 py-3 font-medium">Expires</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-surface-light last:border-0">
                  <td className="px-4 py-3 text-foreground font-medium font-mono">{c.code}</td>
                  <td className="px-4 py-3 text-foreground">
                    {c.discountType === 'PERCENT' ? `${c.amount}%` : `$${c.amount.toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3 text-muted">{c.product ? c.product.title : 'All products'}</td>
                  <td className="px-4 py-3 text-muted">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                  <td className="px-4 py-3 text-muted">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? 'text-green-400 bg-green-400/10' : 'text-muted bg-surface-light'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/store/coupons/${c.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-foreground bg-surface-light rounded-lg hover:bg-surface-light/70 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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
