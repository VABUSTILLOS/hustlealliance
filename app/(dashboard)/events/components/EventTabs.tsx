"use client";

import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Tab = "details" | "discussion" | "attendees";

export default function EventTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  const { t } = useTranslation();

  const tabs: { id: Tab; label: string }[] = [
    { id: "details", label: t.events?.tabs?.details ?? "Details" },
    { id: "discussion", label: t.events?.tabs?.discussion ?? "Discussion" },
    { id: "attendees", label: t.events?.tabs?.attendees ?? "Attendees" },
  ];

  return (
    <div className="flex border-b border-[var(--color-border-subtle)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            "flex-1 sm:flex-none px-4 py-3 text-sm font-medium transition-colors relative",
            activeTab === tab.id
              ? "text-accent"
              : "text-muted hover:text-foreground"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
