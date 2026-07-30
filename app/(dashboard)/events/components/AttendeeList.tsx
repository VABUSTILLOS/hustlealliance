"use client";

import Image from "next/image";
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { RSVPStatus } from "@/lib/generated/prisma/client";
import { useEventAttendees } from "./hooks/useEvents";

const statusLabel: Record<RSVPStatus, string> = {
  GOING: "Going",
  INTERESTED: "Maybe",
  NOT_GOING: "Not Going",
};

export default function AttendeeList({
  eventId,
  filterStatus,
}: {
  eventId: string;
  filterStatus?: RSVPStatus;
}) {
  const { t } = useTranslation();
  const { data: attendees, isLoading, error } = useEventAttendees(eventId, filterStatus);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-[var(--color-border-subtle)]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-[var(--color-border-subtle)] rounded w-24" />
              <div className="h-2.5 bg-[var(--color-border-subtle)] rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{t.events?.failedToLoad ?? "Failed to load attendees"}</p>;
  }

  if (!attendees || attendees.length === 0) {
    return (
      <div className="text-center py-8 text-muted">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
        <p className="text-sm">{t.events?.noAttendees ?? "No attendees yet"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {attendees.map((a) => (
        <div
          key={a.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg)] hover:bg-[var(--color-border-subtle)] transition-colors"
        >
          <div className="relative">
            <Image
              src={a.user.avatar ?? DEFAULT_AVATAR}
              alt={a.user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="absolute -bottom-0.5 -right-0.5 text-[10px]" title={statusLabel[a.status]}>
              {a.status === "GOING" ? "✅" : a.status === "INTERESTED" ? "🤔" : "❌"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={a.user.username ? `/member/${a.user.username}` : "#"}
              className="text-sm font-semibold text-foreground hover:text-accent transition-colors truncate block"
            >
              {a.user.name}
            </Link>
            {a.user.headline && (
              <p className="text-xs text-muted truncate">{a.user.headline}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
