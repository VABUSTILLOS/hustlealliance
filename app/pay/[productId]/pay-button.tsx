'use client';

import { useState } from 'react';
import { getAttribution } from '@/app/components/page-tracker';

type Props = {
  productId: string;
  couponCode: string | null;
  referralCode: string | null;
  path: string;
};

export default function PayButton({ productId, couponCode, referralCode, path }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    setLoading(true);
    setError(null);
    try {
      const origin = window.location.origin;
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'store',
          items: [{ productId, quantity: 1 }],
          ...(couponCode ? { couponCode } : {}),
          successUrl: `${origin}/store/orders?checkout=success`,
          cancelUrl: `${origin}${path}?cancelled=1`,
          attribution: {
            ...getAttribution(),
            path,
            ...(referralCode ? { referralCode } : {}),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = `/login?next=${encodeURIComponent(path)}`;
          return;
        }
        throw new Error(data.error || 'Checkout failed');
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-accent text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Redirecting to checkout…' : 'Buy now'}
      </button>
      {error && <p className="mt-2 text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
}
