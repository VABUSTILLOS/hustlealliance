"use client";

import { memo } from "react";
import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/useTranslation";

export type FeedTab = "personal" | "global" | "spaces";

export const FeedTabs = memo(function FeedTabs({
  active,
  onChange,
}: {
  active: FeedTab;
  onChange: (tab: FeedTab) => void;
}) {
  const { t } = useTranslation();

  const tabs: { id: FeedTab; label: string; icon: string }[] = [
    { id: "personal", label: t.community?.feedPersonal ?? "For You", icon: "👤" },
    { id: "global", label: t.community?.feedGlobal ?? "Global", icon: "🌍" },
    {
      id: "spaces",
      label: t.community?.feedSpaces ?? "Spaces",
      icon: "🚀",
    },
  ];

  return (
    <div role="tablist" className="flex items-center gap-1 mb-6 p-1 bg-surface-light rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none",
            active === tab.id
              ? "bg-surface text-white shadow-sm"
              : "text-muted hover:text-white"
          )}
        >
          <span className="text-sm" aria-hidden="true">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
});
