"use client";

import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { RSVPStatus } from "@/lib/generated/prisma/client";
import { useRSVP, useEventAttendees } from "./hooks/useEvents";

const rsvpOptions: { status: RSVPStatus; icon: string; labelKey: string }[] = [
  { status: "GOING", icon: "✓", labelKey: "going" },
  { status: "INTERESTED", icon: "?", labelKey: "maybe" },
  { status: "NOT_GOING", icon: "✕", labelKey: "notGoing" },
];

export default function RSVPButtons({
  eventId,
  userRSVP,
  isPastOrCancelled,
}: {
  eventId: string;
  userRSVP?: RSVPStatus | null;
  isPastOrCancelled: boolean;
}) {
  const { t } = useTranslation();
  const rsvpMutation = useRSVP(eventId);
  const { data: attendees } = useEventAttendees(eventId);

  const counts: Record<string, number> = {
    GOING: attendees?.filter((a) => a.status === "GOING").length ?? 0,
    INTERESTED: attendees?.filter((a) => a.status === "INTERESTED").length ?? 0,
    NOT_GOING: attendees?.filter((a) => a.status === "NOT_GOING").length ?? 0,
  };

  return (
    <div className="flex items-center gap-2">
      {rsvpOptions.map(({ status, icon, labelKey }) => {
        const isActive = userRSVP === status;
        const label = t.events?.rsvp?.[labelKey as keyof typeof t.events.rsvp] ?? status;
        return (
          <button
            key={status}
            onClick={() => rsvpMutation.mutate(status)}
            disabled={isPastOrCancelled || rsvpMutation.isPending}
            className={clsx(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-accent text-white shadow-md"
                : "bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-foreground hover:border-accent/30",
              (isPastOrCancelled || rsvpMutation.isPending) && "opacity-50 cursor-not-allowed"
            )}
          >
            <span
              className={clsx(
                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                isActive ? "bg-white/20" : "bg-[var(--color-border-subtle)]"
              )}
            >
              {icon}
            </span>
            <span>{label}</span>
            <span className="ml-1 text-xs opacity-70">({counts[status]})</span>
          </button>
        );
      })}
    </div>
  );
}
