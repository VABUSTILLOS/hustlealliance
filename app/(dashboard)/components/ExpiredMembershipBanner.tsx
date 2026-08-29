'use client';

import { useState } from 'react';
import { AlertTriangle, Crown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useDashboard } from '@/lib/hooks/useDashboard';

const TIER_LABELS: Record<string, string> = {
  BASIC: 'Basic',
  PRO: 'Pro',
};

/**
 * Shown when a paid membership has lapsed (membershipExpiresAt in the past).
 * The dashboard API surfaces `access.isExpired` + `access.claimedTier`; this
 * banner prompts the user to renew via the standard subscription checkout.
 */
export default function ExpiredMembershipBanner() {
  const { t } = useTranslation();
  const { data: dashboard } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const access = dashboard?.access;
  if (!access?.isExpired) return null;

  const tier = access.claimedTier && access.claimedTier !== 'FREE' ? access.claimedTier : 'PRO';
  const tierLabel = TIER_LABELS[tier] ?? tier;

  const handleRenew = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          tier,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-heading font-bold text-amber-300">
              {t.paywall.membershipExpired.replace('{tier}', tierLabel)}
            </p>
            <p className="text-xs text-muted font-body truncate">
              {t.paywall.membershipRenew.replace('{tier}', tierLabel)}
            </p>
          </div>
        </div>
        <button
          onClick={handleRenew}
          disabled={loading}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-heading font-bold hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          <Crown className="w-4 h-4" />
          {loading ? '…' : t.paywall.renewNow}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400 font-body">{error}</p>}
    </div>
  );
}
