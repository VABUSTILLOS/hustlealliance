"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useUpcomingEvents } from "@/app/(dashboard)/events/components/hooks/useEvents";

export default function UpcomingEventsWidget() {
  const { t } = useTranslation();
  const { data: events, isLoading } = useUpcomingEvents(3);

  if (isLoading) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-4">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3">
          {t.events?.upcomingEvents ?? "Upcoming Events"}
        </h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-border-subtle)] shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-[var(--color-border-subtle)] rounded w-3/4" />
                <div className="h-2 bg-[var(--color-border-subtle)] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-4">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3">
          {t.events?.upcomingEvents ?? "Upcoming Events"}
        </h3>
        <p className="text-xs text-muted">{t.events?.noUpcoming ?? "No upcoming events"}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-bold text-sm text-foreground">
          {t.events?.upcomingEvents ?? "Upcoming Events"}
        </h3>
        <Link
          href="/events"
          className="text-xs font-medium text-accent hover:underline"
        >
          {t.events?.viewAll ?? "View all"}
        </Link>
      </div>
      <div className="space-y-3">
        {events.map((event) => {
          const date = new Date(event.startDate);
          const month = date.toLocaleString("en-US", { month: "short" });
          const day = date.getDate();
          return (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="flex items-center gap-3 group hover:bg-[var(--color-bg)] rounded-xl p-1.5 -m-1.5 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-accent uppercase leading-none">{month}</span>
                <span className="text-sm font-bold text-foreground leading-none">{day}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                  {event.title}
                </p>
                <p className="text-xs text-muted">
                  {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  {" · "}
                  {event._count.rsvps} {t.events?.attending ?? "attending"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
