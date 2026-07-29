"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { EventCard } from "./hooks/useEvents";

function formatTime(dateStr: string, endDateStr: string | null) {
  const start = new Date(dateStr);
  const fmt: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  const startTime = start.toLocaleTimeString("en-US", fmt);
  if (!endDateStr) return startTime;
  const end = new Date(endDateStr);
  return `${startTime} – ${end.toLocaleTimeString("en-US", fmt)}`;
}

function RSVPStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const colors: Record<string, string> = {
    UPCOMING: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    LIVE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    ENDED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    CANCELLED: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? colors.UPCOMING}`}>
      {t.events?.statusLabels?.[status as keyof typeof t.events.statusLabels] ?? status}
    </span>
  );
}

export default function EventCard({ event }: { event: EventCard }) {
  const { t } = useTranslation();
  const startDate = new Date(event.startDate);
  const month = startDate.toLocaleString("en-US", { month: "short" });
  const day = startDate.getDate();

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-200 hover:shadow-lg"
    >
      {/* Cover image */}
      <div className="relative h-40 bg-gradient-to-br from-accent/20 to-accent/5 overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {/* Date badge */}
            <div className="absolute top-3 left-3 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 text-center shadow-md">
              <div className="text-xs font-bold text-accent uppercase">{month}</div>
              <div className="text-lg font-bold text-foreground leading-tight">{day}</div>
            </div>
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/50 text-white backdrop-blur-sm">
            {event.type === "ONLINE" ? "🎥 Online" : event.type === "IN_PERSON" ? "📍 In Person" : "🔄 Hybrid"}
          </span>
        </div>
        {!event.coverImage && (
          <div className="absolute top-3 left-3 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 text-center shadow-md">
            <div className="text-xs font-bold text-accent uppercase">{month}</div>
            <div className="text-lg font-bold text-foreground leading-tight">{day}</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors truncate">
              {event.title}
            </h3>
            <p className="text-xs text-muted mt-1 line-clamp-2">
              {event.description ?? t.events?.noDescription ?? "No description"}
            </p>
          </div>
          <RSVPStatusBadge status={event.status} />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted mt-3">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {formatTime(event.startDate, event.endDate)}
          </div>
          {event.location && (
            <div className="flex items-center gap-1 truncate">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Bottom row: host + attendee count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <Image
              src={event.creator.avatar ?? "https://api.dicebear.com/9.x/initials/svg?seed=User"}
              alt={event.creator.name}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="text-xs text-muted truncate">{event.creator.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            {event._count.rsvps}
          </div>
        </div>
      </div>
    </Link>
  );
}
