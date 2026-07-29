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
    <div className="flex items-center gap-1 mb-6 p-1 bg-[var(--color-surface-light)] rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all",
            active === tab.id
              ? "bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          )}
        >
          <span className="text-sm">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
});
