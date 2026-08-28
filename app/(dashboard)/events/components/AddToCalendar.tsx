'use client';

import { useState, useRef, useEffect } from 'react';

interface CalendarEvent {
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: string | Date;
  endDate?: string | Date | null;
}

function toIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function googleCalendarUrl(event: CalendarEvent): string {
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toIcsDate(start)}/${toIcsDate(end)}`,
  });
  if (event.description) params.set('details', event.description);
  if (event.location) params.set('location', event.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs(event: CalendarEvent) {
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 60 * 60 * 1000);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HustleAlliance//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.title}-${start.getTime()}@hustlealliance`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
  ];
  if (event.description) lines.push(`DESCRIPTION:${escapeIcs(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeIcs(event.location)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AddToCalendar({ event }: { event: CalendarEvent }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--color-border-subtle)] text-sm text-muted hover:text-foreground hover:border-accent/30 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Add to calendar
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl shadow-lg overflow-hidden z-20">
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener"
            className="block px-4 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors"
            onClick={() => setOpen(false)}
          >
            Google Calendar
          </a>
          <button
            type="button"
            onClick={() => { downloadIcs(event); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors"
          >
            Download .ics
          </button>
        </div>
      )}
    </div>
  );
}
