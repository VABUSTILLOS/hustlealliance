"use client";

import clsx from "clsx";

type ProfileTab = "posts" | "about" | "friends" | "photos";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const TABS: { key: ProfileTab; label: string }[] = [
  { key: "posts", label: "Posts" },
  { key: "about", label: "About" },
  { key: "friends", label: "Friends" },
  { key: "photos", label: "Photos" },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex border-b border-surface-light mt-8">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={clsx(
            "px-5 py-3 text-sm font-heading font-semibold transition-all border-b-2 -mb-px",
            activeTab === tab.key
              ? "text-accent border-accent"
              : "text-muted border-transparent hover:text-foreground hover:border-surface-light",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export type { ProfileTab };
