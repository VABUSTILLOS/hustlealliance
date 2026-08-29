"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useChallenges } from "./components/hooks/useChallenges";
import ChallengeCard from "./components/ChallengeCard";
import type { ChallengeStatus } from "@/lib/generated/prisma/client";

type Tab = "ACTIVE" | "UPCOMING" | "PAST" | "JOINED";

export default function ChallengesPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("ACTIVE");
  const [search, setSearch] = useState("");

  const statusForTab: Record<Tab, ChallengeStatus | undefined> = {
    ACTIVE: "ACTIVE",
    UPCOMING: "UPCOMING",
    PAST: "ENDED",
    JOINED: undefined,
  };

  const { data, isLoading, error } = useChallenges({
    status: statusForTab[tab],
    search: search || undefined,
    limit: 50,
  });

  const challenges = useMemo(() => {
    if (!data) return [];
    if (tab === "JOINED") {
      return data.challenges.filter((c) => (c.enrollments?.length ?? 0) > 0);
    }
    return data.challenges;
  }, [data, tab]);

  const tabs: { value: Tab; label: string }[] = [
    { value: "ACTIVE", label: t.challenges.tabActive },
    { value: "UPCOMING", label: t.challenges.tabUpcoming },
    { value: "PAST", label: t.challenges.tabPast },
    { value: "JOINED", label: t.challenges.tabJoined },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">{t.challenges.pageTitle}</h1>
          <p className="text-sm text-muted mt-1">{t.challenges.pageSubtitle}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-[var(--color-bg)] rounded-xl p-1 border border-[var(--color-border-subtle)]">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.value}
              onClick={() => setTab(tabItem.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === tabItem.value ? "bg-white dark:bg-gray-800 shadow-sm text-foreground" : "text-muted"
              }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.challenges.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] h-80 animate-pulse">
              <div className="h-40 bg-[var(--color-border-subtle)] rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[var(--color-border-subtle)] rounded w-3/4" />
                <div className="h-3 bg-[var(--color-border-subtle)] rounded w-full" />
                <div className="h-3 bg-[var(--color-border-subtle)] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{t.challenges.loadFailed}</p>
        </div>
      ) : challenges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-50">🏆</div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{t.challenges.noChallenges}</h3>
          <p className="text-sm text-muted mb-4">{t.challenges.noChallengesSubtitle}</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold">
            {t.challenges.backToDashboard}
          </Link>
        </div>
      )}
    </div>
  );
}
