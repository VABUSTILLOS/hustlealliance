"use client";

import { useMemo } from "react";
import clsx from "clsx";
import type { EventCard } from "./hooks/useEvents";

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i++) {
    currentWeek.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(new Date(year, month, d));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }
  return weeks;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EventCalendar({
  events,
  year,
  month,
  onMonthChange,
  onDayClick,
}: {
  events: EventCard[];
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  onDayClick: (date: Date) => void;
}) {
  const eventMap = useMemo(() => {
    const map = new Map<string, EventCard[]>();
    for (const event of events) {
      const d = new Date(event.startDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const weeks = useMemo(() => getMonthDays(year, month), [year, month]);
  const today = new Date();

  function prevMonth() {
    if (month === 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, month - 1);
  }

  function nextMonth() {
    if (month === 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, month + 1);
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-[var(--color-border-subtle)] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h3 className="font-semibold text-foreground text-sm">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-[var(--color-border-subtle)] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-muted uppercase tracking-wider py-2 border-b border-[var(--color-border-subtle)]">
        {DAY_HEADERS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Weeks */}
      <div className="p-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => (
              <div
                key={di}
                className="aspect-square p-0.5"
              >
                {day ? (
                  <button
                    onClick={() => onDayClick(day)}
                    className={clsx(
                      "w-full h-full rounded-lg text-xs flex flex-col items-center justify-start pt-1 transition-colors relative",
                      today.toDateString() === day.toDateString()
                        ? "bg-accent/10 text-accent font-bold"
                        : "hover:bg-[var(--color-border-subtle)] text-foreground"
                    )}
                  >
                    <span>{day.getDate()}</span>
                    {(() => {
                      const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                      const dayEvents = eventMap.get(key);
                      if (dayEvents && dayEvents.length > 0) {
                        return (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayEvents.slice(0, 3).map((_, i) => (
                              <div key={i} className="w-1 h-1 rounded-full bg-accent" />
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </button>
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
