"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useEvents } from "./components/hooks/useEvents";
import EventCard from "./components/EventCard";
import EventCalendar from "./components/EventCalendar";
import type { EventStatus, EventType } from "@/lib/generated/prisma/client";

type ViewMode = "list" | "calendar";

export default function EventsPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<EventType | "">("");
  const [myEvents, setMyEvents] = useState(false);

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const { data, isLoading, error } = useEvents({
    status: statusFilter || undefined,
    type: typeFilter || undefined,
    search: search || undefined,
    limit: 50,
  });

  const statuses: { value: EventStatus; label: string }[] = [
    { value: "UPCOMING", label: t.events?.statusLabels?.UPCOMING ?? "Upcoming" },
    { value: "LIVE", label: t.events?.statusLabels?.LIVE ?? "Live" },
    { value: "ENDED", label: t.events?.statusLabels?.ENDED ?? "Ended" },
    { value: "CANCELLED", label: t.events?.statusLabels?.CANCELLED ?? "Cancelled" },
  ];

  const types: { value: EventType; label: string }[] = [
    { value: "ONLINE", label: t.events?.type?.online ?? "Online" },
    { value: "IN_PERSON", label: t.events?.type?.inPerson ?? "In Person" },
    { value: "HYBRID", label: t.events?.type?.hybrid ?? "Hybrid" },
  ];

  function handleDayClick(date: Date) {
    setCalYear(date.getFullYear());
    setCalMonth(date.getMonth());
    setViewMode("list");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {t.events?.title ?? "Events"}
          </h1>
          <p className="text-sm text-muted mt-1">
            {t.events?.subtitle ?? "Discover and join community events"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-[var(--color-bg)] rounded-xl p-1 border border-[var(--color-border-subtle)]">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "list" ? "bg-white dark:bg-gray-800 shadow-sm text-foreground" : "text-muted"
              }`}
            >
              <svg className="w-4 h-4 inline mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              {t.events?.list ?? "List"}
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "calendar" ? "bg-white dark:bg-gray-800 shadow-sm text-foreground" : "text-muted"
              }`}
            >
              <svg className="w-4 h-4 inline mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {t.events?.calendar ?? "Calendar"}
            </button>
          </div>
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t.events?.createEvent ?? "Create Event"}
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.events?.search ?? "Search events..."}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EventStatus | "")}
          className="px-4 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="">{t.events?.allStatuses ?? "All Statuses"}</option>
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as EventType | "")}
          className="px-4 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="">{t.events?.allTypes ?? "All Types"}</option>
          {types.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* My Events toggle */}
        <button
          onClick={() => setMyEvents(!myEvents)}
          className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
            myEvents
              ? "bg-accent/10 border-accent text-accent"
              : "bg-[var(--color-bg)] border-[var(--color-border-subtle)] text-muted hover:border-accent/30"
          }`}
        >
          {t.events?.myEvents ?? "My Events"}
        </button>
      </div>

      {/* Content */}
      {viewMode === "calendar" ? (
        <EventCalendar
          events={data?.events ?? []}
          year={calYear}
          month={calMonth}
          onMonthChange={(y, m) => { setCalYear(y); setCalMonth(m); }}
          onDayClick={handleDayClick}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] h-80 animate-pulse">
              <div className="h-40 bg-[var(--color-border-subtle)] rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[var(--color-border-subtle)] rounded w-3/4" />
                <div className="h-3 bg-[var(--color-border-subtle)] rounded w-full" />
                <div className="h-3 bg-[var(--color-border-subtle)] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{t.events?.failedToLoad ?? "Failed to load events"}</p>
        </div>
      ) : data && data.events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto mb-4 text-muted opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <h3 className="text-lg font-semibold text-foreground mb-1">{t.events?.noEvents ?? "No events found"}</h3>
          <p className="text-sm text-muted mb-4">{t.events?.noEventsDesc ?? "Be the first to create an event!"}</p>
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold"
          >
            {t.events?.createFirst ?? "Create the first event"}
          </Link>
        </div>
      )}
    </div>
  );
}
