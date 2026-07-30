"use client";

import Image from "next/image";
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { EventDetail } from "./hooks/useEvents";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr: string, endDateStr: string | null) {
  const start = new Date(dateStr);
  const fmt: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", timeZoneName: "short" };
  const startTime = start.toLocaleTimeString("en-US", fmt);
  if (!endDateStr) return startTime;
  const end = new Date(endDateStr);
  return `${startTime} – ${end.toLocaleTimeString("en-US", fmt)}`;
}

function getDefaultImage(slug: string) {
  return `https://picsum.photos/seed/${slug}/1200/600.webp`;
}

export default function EventHeader({ event }: { event: EventDetail }) {
  const { t } = useTranslation();
  const coverSrc = event.coverImage || getDefaultImage(event.slug);

  const statusBadge: Record<string, { label: string; color: string }> = {
    UPCOMING: { label: t.events?.statusLabels?.UPCOMING ?? "Upcoming", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    LIVE: { label: t.events?.statusLabels?.LIVE ?? "Live", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse" },
    ENDED: { label: t.events?.statusLabels?.ENDED ?? "Ended", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    CANCELLED: { label: t.events?.statusLabels?.CANCELLED ?? "Cancelled", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  };

  const badge = statusBadge[event.status] ?? statusBadge.UPCOMING;
  const startDate = new Date(event.startDate);
  const month = startDate.toLocaleString("en-US", { month: "short" });
  const day = startDate.getDate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
      {/* Cover */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-accent/30 to-accent/5">
        <Image src={coverSrc} alt={event.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative px-6 pb-6 -mt-20">
        {/* Date badge */}
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-center shadow-lg">
            <div className="text-xs font-bold text-accent uppercase">{month}</div>
            <div className="text-xl font-bold text-foreground leading-tight">{day}</div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
            {badge.label}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">{event.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{formatTime(event.startDate, event.endDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 truncate">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Host info */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
          <Image
            src={event.creator.avatar ?? DEFAULT_AVATAR}
            alt={event.creator.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="text-xs text-muted">{t.events?.hostedBy ?? "Hosted by"}</p>
            <p className="text-sm font-semibold text-foreground">{event.creator.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
