"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ChecklistItem = {
  key: string;
  label: string;
  done: boolean;
};

const DISMISS_KEY = "onboarding.checklist.dismissed";

const ITEM_LINKS: Record<string, string> = {
  profileCompleted: "/profile",
  onboardingDone: "/onboarding",
  joinedGroup: "/groups",
  followedMember: "/community/members",
  enrolledCourse: "/learning",
  firstPost: "/community",
};

export default function GettingStartedChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY) === "true",
  );

  useEffect(() => {
    fetch("/api/onboarding/checklist")
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  }

  if (loading || dismissed) return null;

  const doneCount = items.filter((i) => i.done).length;
  if (items.length === 0 || doneCount === items.length) return null;

  const progressPct = Math.round((doneCount / items.length) * 100);

  return (
    <div className="bg-surface border border-surface-light rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-semibold text-foreground text-sm">Getting started</h3>
        <button
          onClick={handleDismiss}
          className="text-muted hover:text-foreground text-xs transition"
          aria-label="Dismiss getting started checklist"
        >
          Dismiss
        </button>
      </div>

      <div className="h-1.5 w-full bg-surface-light rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="text-xs text-muted mb-4">
        {doneCount} of {items.length} complete
      </p>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.key}>
            {item.done ? (
              <span className="flex items-center gap-2 text-sm text-muted">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent text-xs">
                  ✓
                </span>
                <span className="line-through">{item.label}</span>
              </span>
            ) : (
              <Link
                href={ITEM_LINKS[item.key] ?? "/dashboard"}
                className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-surface-light text-xs">
                  {" "}
                </span>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
