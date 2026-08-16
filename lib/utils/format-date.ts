/**
 * Shared date/time formatting utilities.
 *
 * Consolidates copy-pasted date formatters that previously lived in event,
 * space, community, and course components. Each function reproduces the exact
 * output of the original implementations — see individual callers for usage.
 */

export type RelativeTimeStyle = 'compact' | 'intl' | 'plain';

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
}

/**
 * Formats a date as a localized date string.
 *
 * With no options, reproduces the event header/detail format:
 *   "Monday, January 15, 2024"
 * (en-US, `weekday: long, year: numeric, month: long, day: numeric`).
 * Pass Intl options (e.g. `{ year: "numeric", month: "short", day: "numeric" }`)
 * to get other formats.
 */
export function formatDate(input: string | Date, opts: FormatDateOptions = {}): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const { locale = 'en-US', ...options } = opts;
  const resolved: Intl.DateTimeFormatOptions =
    Object.keys(options).length > 0
      ? options
      : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(locale, resolved);
}

/**
 * Formats a start (and optional end) time as a range.
 *
 * Reproduces the event card/header format:
 *   "2:00 PM"
 *   "2:00 PM – 4:00 PM"
 * Pass `{ timeZoneName: "short" }` to include the time zone (event header).
 */
export function formatTimeRange(
  start: string | Date,
  end?: string | Date | null,
  opts: { timeZoneName?: 'short' | 'long' } = {}
): string {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const fmt: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
  if (opts.timeZoneName) fmt.timeZoneName = opts.timeZoneName;
  const startTime = startDate.toLocaleTimeString('en-US', fmt);
  if (!end) return startTime;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  return `${startTime} – ${endDate.toLocaleTimeString('en-US', fmt)}`;
}

/**
 * Returns the default cover image URL for an event (picsum placeholder).
 * Sizes reproduce the event card (800/400) and event header (1200/600) variants.
 */
export function getEventCoverImage(slug: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${slug}/${width}/${height}.webp`;
}

/**
 * Formats a date as a human-readable relative time string.
 *
 * Styles (each reproduces a previous per-component implementation exactly):
 *  - `compact` (default): "Just now", "5m ago", "2h ago", "Yesterday", "3d ago", "Jan 15"
 *    (previously `lib/utils/date.ts#formatRelativeTime`).
 *  - `intl`: uses `Intl.RelativeTimeFormat` with the given locale for
 *    "just now"/"5 minutes ago" etc., falling back to a localized date after 7 days
 *    (previously FeedItemCard's `formatTimeAgo`).
 *  - `plain`: lowercase "just now", "5m ago", "5h ago", "5d ago", falling back to
 *    "Jan 15" after 30 days (previously CourseStudyGroup's `timeAgo`).
 */
export function formatRelativeTime(
  input: string | Date,
  opts: { style?: RelativeTimeStyle; locale?: string } = {}
): string {
  const style = opts.style ?? 'compact';
  const locale = opts.locale ?? 'en';
  const date = typeof input === 'string' ? new Date(input) : input;

  switch (style) {
    case 'intl':
      return formatRelativeTimeIntl(date, locale);
    case 'plain':
      return formatRelativeTimePlain(date);
    case 'compact':
    default:
      return formatRelativeTimeCompact(date);
  }
}

/** Reproduces `lib/utils/date.ts#formatRelativeTime`. */
function formatRelativeTimeCompact(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 6) return `${diffHour}h ago`;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffFromToday = (today.getTime() - dateStart.getTime()) / 86400000;

  if (diffFromToday === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (diffFromToday === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

/** Reproduces FeedItemCard's `formatTimeAgo`. */
function formatRelativeTimeIntl(date: Date, locale: string): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (mins < 1) return formatter.format(0, 'second');
  if (mins < 60) return formatter.format(-mins, 'minute');

  const hours = Math.floor(mins / 60);
  if (hours < 24) return formatter.format(-hours, 'hour');

  const days = Math.floor(hours / 24);
  if (days < 7) return formatter.format(-days, 'day');

  return date.toLocaleDateString(locale);
}

/** Reproduces CourseStudyGroup's `timeAgo`. */
function formatRelativeTimePlain(date: Date): string {
  const now = Date.now();
  const then = date.getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
