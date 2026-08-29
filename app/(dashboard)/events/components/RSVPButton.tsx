"use client";

import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
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
  maxAttendees,
}: {
  eventId: string;
  userRSVP?: RSVPStatus | null;
  isPastOrCancelled: boolean;
  maxAttendees?: number | null;
}) {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const rsvpMutation = useRSVP(eventId);
  const { data: attendees } = useEventAttendees(eventId);

  // Fall back to the attendees list when the page doesn't supply the user's RSVP
  const myRsvp: RSVPStatus | null =
    userRSVP ?? attendees?.find((a) => a.user?.id === user?.id)?.status ?? null;

  const counts: Record<string, number> = {
    GOING: attendees?.filter((a) => a.status === "GOING").length ?? 0,
    INTERESTED: attendees?.filter((a) => a.status === "INTERESTED").length ?? 0,
    NOT_GOING: attendees?.filter((a) => a.status === "NOT_GOING").length ?? 0,
    WAITLIST: attendees?.filter((a) => a.status === "WAITLIST").length ?? 0,
  };

  const spotsLeft = maxAttendees != null ? Math.max(0, maxAttendees - counts.GOING) : null;
  const onWaitlist = myRsvp === "WAITLIST";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        {rsvpOptions.map(({ status, icon, labelKey }) => {
          const isActive = myRsvp === status;
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
        {onWaitlist && (
          <span className="px-4 py-2 rounded-xl text-sm font-medium bg-amber-500/15 border border-amber-500/40 text-amber-400">
            ⏳ {t.events?.rsvp?.waitlisted ?? "Waitlisted"}
          </span>
        )}
      </div>
      {spotsLeft != null && !isPastOrCancelled && (
        <p className="font-mono text-xs text-muted">
          {spotsLeft > 0
            ? `${spotsLeft} ${t.events?.rsvp?.spotsLeft ?? "spots left"}`
            : `${counts.WAITLIST} ${t.events?.rsvp?.onWaitlist ?? "on waitlist"}`}
        </p>
      )}
    </div>
  );
}
