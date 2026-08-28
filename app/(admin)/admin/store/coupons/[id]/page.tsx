'use client';

import { useState, useEffect, use } from 'react';
import { CouponForm, type CouponFormValue } from '../components/CouponForm';

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initial, setInitial] = useState<Partial<CouponFormValue> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/coupons/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const c = data.coupon;
        if (!c) return;
        setInitial({
          code: c.code,
          description: c.description ?? '',
          discountType: c.discountType,
          amount: c.amount,
          currency: c.currency,
          productId: c.productId ?? '',
          maxUses: c.maxUses,
          expiresAt: c.expiresAt ?? '',
          isActive: c.isActive,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-8">Edit Coupon</h1>
      {loading ? (
        <div className="glass-card p-8 text-center text-muted">Loading…</div>
      ) : initial ? (
        <CouponForm initial={initial} couponId={id} />
      ) : (
        <div className="glass-card p-8 text-center text-muted">Coupon not found.</div>
      )}
    </div>
  );
}
