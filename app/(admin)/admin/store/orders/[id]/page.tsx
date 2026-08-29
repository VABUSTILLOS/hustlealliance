'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

type OrderDetail = {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  stripePaymentIntentId: string | null;
  notes: string | null;
  createdAt: string;
  paidAt: string | null;
  updatedAt: string;
  abandonedEmailSentAt: string | null;
  user: { id: string; name: string; email: string } | null;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: { id: string; title: string; slug: string; type: string } | null;
  }[];
  couponRedemptions: { id: string; coupon: { code: string; discountType: string; amount: number } }[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  PAID: 'text-green-400 bg-green-400/10',
  FULFILLED: 'text-blue-400 bg-blue-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  REFUNDED: 'text-gray-400 bg-gray-400/10',
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [fulfilling, setFulfilling] = useState(false);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState('');

  const load = () => {
    setLoading(true);
    fetch(`/api/admin/store/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order ?? null);
        setNotes(data.order?.notes ?? '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleRefund = async () => {
    if (!order) return;
    if (!confirm(`Refund this $${order.totalAmount.toFixed(2)} order? This cannot be undone.`)) return;
    setRefunding(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/store/orders/${id}/refund`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Refund failed');
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRefunding(false);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch(`/api/admin/store/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      setNotice('Notes saved.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleFulfill = async () => {
    setFulfilling(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/store/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markFulfilled: true }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setFulfilling(false);
    }
  };

  const handleResendReceipt = async () => {
    setResending(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch(`/api/admin/store/orders/${id}/resend-receipt`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setNotice(data.demo ? 'Receipt logged (demo mode — no RESEND_API_KEY).' : 'Receipt sent.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setResending(false);
    }
  };

  if (loading) return <div className="p-4 md:p-8 text-muted">Loading…</div>;
  if (!order) return <div className="p-4 md:p-8 text-muted">Order not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <Link href="/admin/store/orders" className="text-sm text-muted hover:text-foreground mb-6 inline-block">
        ← Back to orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-muted text-sm mt-1">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status] || 'text-muted bg-surface-light'}`}>
          {order.status}
        </span>
      </div>

      {error && <div className="p-3 mb-4 bg-red-400/10 text-red-400 rounded-xl text-sm">{error}</div>}
      {notice && <div className="p-3 mb-4 bg-green-400/10 text-green-400 rounded-xl text-sm">{notice}</div>}

      <div className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-muted mb-3">Customer</h2>
        <p className="text-foreground">{order.user?.name ?? 'Unknown'}</p>
        <p className="text-muted text-sm">{order.user?.email ?? '—'}</p>
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-muted mb-3">Line items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="text-foreground">{item.product?.title ?? 'Unknown product'}</p>
                <p className="text-muted text-xs">
                  {item.quantity} × ${item.unitPrice.toFixed(2)}
                  {item.product?.type ? ` · ${item.product.type}` : ''}
                </p>
              </div>
              <p className="text-foreground font-medium">${item.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-surface-light flex items-center justify-between">
          <span className="text-muted text-sm">Total</span>
          <span className="text-foreground font-semibold">${order.totalAmount.toFixed(2)} {order.currency}</span>
        </div>
      </div>

      {order.couponRedemptions.length > 0 && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-sm font-semibold text-muted mb-3">Coupons redeemed</h2>
          {order.couponRedemptions.map((r) => (
            <p key={r.id} className="text-sm text-foreground">
              {r.coupon.code} — {r.coupon.discountType === 'PERCENT' ? `${r.coupon.amount}%` : `$${r.coupon.amount.toFixed(2)}`} off
            </p>
          ))}
        </div>
      )}

      <div className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-muted mb-3">Payment & timeline</h2>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between">
            <dt className="text-muted">Stripe payment intent</dt>
            <dd className="text-foreground font-mono text-xs">{order.stripePaymentIntentId ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Created</dt>
            <dd className="text-foreground">{new Date(order.createdAt).toLocaleString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Paid</dt>
            <dd className="text-foreground">{order.paidAt ? new Date(order.paidAt).toLocaleString() : '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Last updated</dt>
            <dd className="text-foreground">{new Date(order.updatedAt).toLocaleString()}</dd>
          </div>
          {order.abandonedEmailSentAt && (
            <div className="flex justify-between">
              <dt className="text-muted">Abandoned-cart email sent</dt>
              <dd className="text-foreground">{new Date(order.abandonedEmailSentAt).toLocaleString()}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-muted mb-3">Internal notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Only visible to admins…"
          className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
        />
        <button
          onClick={saveNotes}
          disabled={savingNotes}
          className="mt-3 px-4 py-2 bg-surface-light text-foreground rounded-xl text-sm font-medium hover:bg-surface-light/70 transition-colors disabled:opacity-50"
        >
          {savingNotes ? 'Saving…' : 'Save notes'}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {order.status === 'PAID' && (
          <button
            onClick={handleFulfill}
            disabled={fulfilling}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {fulfilling ? 'Updating…' : 'Mark fulfilled'}
          </button>
        )}
        {(order.status === 'PAID' || order.status === 'FULFILLED') && (
          <button
            onClick={handleResendReceipt}
            disabled={resending}
            className="px-6 py-2.5 bg-surface-light text-foreground rounded-xl font-medium text-sm hover:bg-surface-light/70 transition-colors disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend receipt'}
          </button>
        )}
        {order.status !== 'REFUNDED' && order.status !== 'CANCELLED' && (
          <button
            onClick={handleRefund}
            disabled={refunding}
            className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-medium text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {refunding ? 'Refunding…' : 'Refund order'}
          </button>
        )}
      </div>
    </div>
  );
}
