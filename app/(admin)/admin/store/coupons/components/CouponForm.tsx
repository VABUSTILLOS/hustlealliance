'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type CouponFormValue = {
  code: string;
  description: string;
  discountType: string;
  amount: number;
  currency: string;
  productId: string;
  maxUses: number | null;
  expiresAt: string;
  isActive: boolean;
};

const EMPTY_FORM: CouponFormValue = {
  code: '',
  description: '',
  discountType: 'PERCENT',
  amount: 10,
  currency: 'USD',
  productId: '',
  maxUses: null,
  expiresAt: '',
  isActive: true,
};

export function CouponForm({
  initial,
  couponId,
}: {
  initial?: Partial<CouponFormValue>;
  couponId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<CouponFormValue>({ ...EMPTY_FORM, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/products?limit=100')
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.amount) return;
    setSaving(true);
    setError('');

    const payload = {
      code: form.code.toUpperCase(),
      description: form.description || null,
      discountType: form.discountType,
      amount: form.amount,
      currency: form.currency,
      productId: form.productId || null,
      maxUses: form.maxUses,
      expiresAt: form.expiresAt || null,
      isActive: form.isActive,
    };

    try {
      const res = await fetch(couponId ? `/api/admin/coupons/${couponId}` : '/api/admin/coupons', {
        method: couponId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save coupon');
      }
      router.push('/admin/store/coupons');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {error && (
        <div className="p-3 bg-red-400/10 text-red-400 rounded-xl text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm text-muted mb-1.5">Code</label>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm font-mono uppercase focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Discount type</label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          >
            <option value="PERCENT">Percent (%)</option>
            <option value="FIXED">Fixed amount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">
            Amount {form.discountType === 'PERCENT' ? '(%)' : `(${form.currency})`}
          </label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Scope (limit to a single product)</label>
        <select
          name="productId"
          value={form.productId}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
        >
          <option value="">All products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Max uses (blank = unlimited)</label>
          <input
            type="number"
            name="maxUses"
            value={form.maxUses ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Expires at</label>
          <input
            type="date"
            name="expiresAt"
            value={form.expiresAt ? form.expiresAt.slice(0, 10) : ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
        />
        <span className="text-sm text-foreground">Active</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Coupon'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/store/coupons')}
          className="px-6 py-2.5 bg-surface border border-surface-light text-foreground rounded-xl font-medium text-sm hover:bg-surface-light transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
