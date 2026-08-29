"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { ReferralDashboard } from "@/lib/db/referrals";

function useReferralDashboard() {
  return useQuery<ReferralDashboard>({
    queryKey: ["referrals", "dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/referrals");
      if (!res.ok) throw new Error("Failed to load referrals");
      return res.json();
    },
    staleTime: 30_000,
  });
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400",
  CONVERTED: "bg-blue-500/15 text-blue-400",
  REWARDED: "bg-green-500/15 text-green-400",
};

function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // clipboard unavailable — ignore
        }
      }}
      className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

export default function ReferralsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useReferralDashboard();

  const shareUrl = useMemo(() => {
    if (!data || typeof window === "undefined") return "";
    return `${window.location.origin}/r/${data.referralCode}`;
  }, [data]);

  const shareText = t.referrals.shareText;

  const shareTargets = useMemo(() => {
    if (!shareUrl) return [];
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${shareText} ${shareUrl}`);
    return [
      {
        key: "x",
        label: "X",
        href: `https://twitter.com/intent/tweet?text=${encodedText}`,
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        ),
      },
      {
        key: "whatsapp",
        label: "WhatsApp",
        href: `https://wa.me/?text=${encodedText}`,
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        ),
      },
      {
        key: "email",
        label: "Email",
        href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodedUrl}`,
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
    ];
  }, [shareUrl, shareText]);

  if (isLoading || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-[var(--color-surface)]" />
          <div className="h-32 rounded-2xl bg-[var(--color-surface)]" />
          <div className="h-64 rounded-2xl bg-[var(--color-surface)]" />
        </div>
      </div>
    );
  }

  const { stats, referrals, rewards, rewardConfig } = data;

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: shareText, text: shareText, url: shareUrl });
    } catch {
      // user cancelled or share unsupported
    }
  };

  const statCards = [
    { label: t.referrals.stats.invited, value: stats.invited },
    { label: t.referrals.stats.converted, value: stats.converted },
    { label: t.referrals.stats.rewarded, value: stats.rewarded },
    { label: t.referrals.stats.rewards, value: rewards.length },
  ];

  const steps = [
    { title: t.referrals.howItWorks.step1Title, desc: t.referrals.howItWorks.step1Desc },
    { title: t.referrals.howItWorks.step2Title, desc: t.referrals.howItWorks.step2Desc },
    {
      title: t.referrals.howItWorks.step3Title,
      desc: t.referrals.howItWorks.step3Desc.replace("{percent}", String(rewardConfig.percentOff)),
    },
  ];

  const statusLabel = (status: string) =>
    status === "PENDING"
      ? t.referrals.status.pending
      : status === "CONVERTED"
        ? t.referrals.status.converted
        : t.referrals.status.rewarded;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">{t.referrals.title}</h1>
        <p className="text-sm text-muted mt-1">
          {t.referrals.subtitle.replace("{percent}", String(rewardConfig.percentOff))}
        </p>
      </div>

      {/* Invite link hero */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{t.referrals.yourLink}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-sm text-foreground font-mono truncate flex items-center">
            {shareUrl}
          </div>
          <CopyButton text={shareUrl} label={t.referrals.copyLink} copiedLabel={t.referrals.copied} />
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-light border border-[var(--color-border-subtle)] text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t.referrals.share}
            </button>
          )}
          {shareTargets.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-light border border-[var(--color-border-subtle)] text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-4"
          >
            <p className="text-2xl font-bold text-foreground tabular-nums">{card.value}</p>
            <p className="text-xs text-muted mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-foreground mb-4">{t.referrals.howItWorks.title}</h2>
        <ol className="grid sm:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-accent/15 text-accent text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted mt-1">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Referral list */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-foreground mb-3">{t.referrals.yourReferrals}</h2>
        {referrals.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">{t.referrals.emptyReferrals}</p>
        ) : (
          <ul className="divide-y divide-[var(--color-border-subtle)]">
            {referrals.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                {r.refereeAvatar ? (
                  <Image
                    src={r.refereeAvatar}
                    alt={r.refereeName ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-[var(--color-border-subtle)] flex items-center justify-center text-xs font-bold text-muted">
                    {(r.refereeName ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{r.refereeName ?? t.referrals.pendingMember}</p>
                  <p className="text-xs text-muted">
                    {new Date(r.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded ${STATUS_STYLES[r.status] ?? "bg-surface-light text-muted"}`}
                >
                  {statusLabel(r.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Rewards */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
        <h2 className="font-semibold text-foreground mb-3">{t.referrals.yourRewards}</h2>
        {rewards.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">
            {t.referrals.emptyRewards.replace("{percent}", String(rewardConfig.percentOff))}
          </p>
        ) : (
          <ul className="space-y-2">
            {rewards.map((coupon) => {
              const usedUp = coupon.maxUses != null && coupon.usedCount >= coupon.maxUses;
              const active = coupon.isActive && !usedUp;
              return (
                <li
                  key={coupon.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono font-semibold text-foreground">{coupon.code}</p>
                    <p className="text-xs text-muted">
                      {coupon.discountType === "PERCENT"
                        ? t.referrals.percentOff.replace("{percent}", String(coupon.amount))
                        : `$${coupon.amount.toFixed(2)} ${t.referrals.off}`}
                      {" · "}
                      {active ? t.referrals.rewardActive : t.referrals.rewardUsed}
                    </p>
                  </div>
                  {active && (
                    <CopyButton text={coupon.code} label={t.referrals.copyCode} copiedLabel={t.referrals.copied} />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
