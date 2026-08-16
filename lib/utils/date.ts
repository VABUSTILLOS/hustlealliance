import { formatRelativeTime } from './format-date';

/**
 * Formats a date string or Date as a human-readable relative time.
 * Returns: "Just now", "5m ago", "2h ago", "Yesterday", "3d ago", "Jan 15", etc.
 * (Re-exported from `./format-date` so this stays the compact style.)
 */
export { formatRelativeTime };

/**
 * Groups a date into: 'Today', 'Yesterday', 'This Week', 'Older'
 */
export function groupByDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = (today.getTime() - dateStart.getTime()) / 86400000;

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return 'This Week';
  return 'Older';
}
