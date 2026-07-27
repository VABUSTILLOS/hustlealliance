'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Crown, ShoppingCart, Zap, Shield } from 'lucide-react';
import clsx from 'clsx';

export type UpgradeOption = {
  type: 'subscription' | 'purchase_course' | 'purchase_lesson';
  tier?: 'FREE' | 'BASIC' | 'PRO';
  courseId?: string;
  courseTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  price?: number | null;
};

interface PaywallProps {
  requiredTier: string;
  userTier: string;
  upgradeOptions: UpgradeOption[];
  contentTitle: string;
  contentDescription?: string;
  onPurchase?: (option: UpgradeOption) => void;
}

const TIER_LABELS: Record<string, string> = {
  FREE: 'Free',
  BASIC: 'Basic',
  PRO: 'Pro',
};

const TIER_DESCRIPTIONS: Record<string, string> = {
  FREE: 'Free members can access free courses and purchase premium content à la carte.',
  BASIC: 'Basic members get all Free + Basic content, plus à la carte Pro purchases.',
  PRO: 'Pro members get unlimited access to everything.',
};

export default function Paywall({
  requiredTier,
  userTier,
  upgradeOptions,
  contentTitle,
  contentDescription,
  onPurchase,
}: PaywallProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (option: UpgradeOption) => {
    if (onPurchase) {
      onPurchase(option);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: option.type === 'subscription' ? 'subscription' : 'course',
          tier: option.tier,
          courseId: option.courseId,
          lessonId: option.lessonId,
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Verify via webhook (simulated in demo, real with Stripe)
        if (data.demo) {
          // Simulate webhook processing for demo
          await fetch('/api/stripe/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'checkout.session.completed',
              data: {
                object: {
                  metadata: {
                    userId: '', // will be resolved by server from session
                    type: option.type === 'subscription' ? 'subscription' : 'course',
                    courseId: option.courseId || '',
                    lessonId: option.lessonId || '',
                    tier: option.tier || '',
                  },
                  amount_total: (option.price || 0) * 100,
                  currency: 'usd',
                },
              },
            }),
          });
        }
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-surface-light bg-surface"
    >
      {/* ── Gradient overlay ───────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative p-8 lg:p-12">
        {/* ── Lock icon + header ───────────────── */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <Lock className="w-7 h-7 text-accent" />
          </motion.div>

          <h2 className="font-display text-3xl lg:text-4xl text-foreground uppercase leading-tight mb-3">
            {requiredTier === 'PRO' ? 'Pro Content' : 'Premium Content'}
          </h2>

          <p className="text-muted font-body text-base max-w-lg mx-auto">
            {contentDescription ||
              `"${contentTitle}" requires ${TIER_LABELS[requiredTier]} access. Upgrade to unlock this content and more.`}
          </p>
        </div>

        {/* ── Current tier indicator ───────────── */}
        <div className="flex items-center justify-center gap-3 mb-8 pb-8 border-b border-surface-light">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-light">
            <Shield className="w-4 h-4 text-muted" />
            <span className="text-sm text-muted font-body">
              You&apos;re on the{' '}
              <span className="font-bold text-foreground">{TIER_LABELS[userTier]}</span> tier
            </span>
          </div>
          <span className="text-muted text-lg">→</span>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Crown className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold text-accent font-body">
              {TIER_LABELS[requiredTier]} required
            </span>
          </div>
        </div>

        {/* ── Upgrade options ──────────────────── */}
        <div className="space-y-4 max-w-lg mx-auto">
          {upgradeOptions.map((option, i) => (
            <motion.button
              key={`${option.type}-${option.tier || option.courseId || i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => handleAction(option)}
              disabled={isLoading}
              className={clsx(
                'w-full flex items-center justify-between p-5 rounded-xl border transition-all duration-300',
                option.type === 'subscription'
                  ? 'bg-accent/10 border-accent/30 hover:bg-accent/20 hover:border-accent/50 hover:scale-[1.02]'
                  : 'bg-surface-light border-white/10 hover:border-white/20 hover:bg-white/5 hover:scale-[1.02]'
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={clsx(
                    'flex items-center justify-center w-10 h-10 rounded-lg',
                    option.type === 'subscription'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-white/5 text-foreground-muted'
                  )}
                >
                  {option.type === 'subscription' && <Crown className="w-5 h-5" />}
                  {option.type === 'purchase_course' && <ShoppingCart className="w-5 h-5" />}
                  {option.type === 'purchase_lesson' && <Zap className="w-5 h-5" />}
                </div>

                <div className="text-left">
                  <span className="block text-sm font-heading font-bold text-foreground">
                    {option.type === 'subscription' && `Upgrade to ${TIER_LABELS[option.tier || 'PRO']}`}
                    {option.type === 'purchase_course' &&
                      `Buy "${option.courseTitle}"`}
                    {option.type === 'purchase_lesson' &&
                      `Buy "${option.lessonTitle}"`}
                  </span>
                  {option.type === 'subscription' && (
                    <span className="block text-xs text-muted font-body mt-0.5">
                      {TIER_DESCRIPTIONS[option.tier || 'PRO']}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                {option.type === 'subscription' && (
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">
                    {option.tier === 'BASIC' ? 'From $19/mo' : 'From $49/mo'}
                  </span>
                )}
                {option.type !== 'subscription' && option.price != null && (
                  <span className="text-sm font-heading font-bold text-accent">
                    ${option.price}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Footer note ──────────────────────── */}
        <p className="text-center text-xs text-muted font-body mt-8">
          One-time purchases grant permanent access to this content.
        </p>
      </div>
    </motion.div>
  );
}
