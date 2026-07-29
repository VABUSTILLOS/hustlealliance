// lib/seed/utils.ts — Deterministic seeding utilities
// Uses a simple mulberry32 PRNG for reproducible yet randomized data.

// ── PRNG ──────────────────────────────────────────────────────────────────
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const random = mulberry32(42); // Fixed seed for reproducibility

// ── Random helpers ─────────────────────────────────────────────────────────
export function randInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function randFloat(min: number, max: number): number {
  return random() * (max - min) + min;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

export function pickWeighted<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => random() - 0.5);
  return shuffled.slice(0, n);
}

export function sliceRandom<T>(arr: T[], min: number, max: number): T[] {
  const count = randInt(min, max);
  return pickN(arr, count);
}

// ── ID generation ──────────────────────────────────────────────────────────
export function cuid(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'c';
  for (let i = 0; i < 24; i++) id += chars[randInt(0, chars.length - 1)];
  return id;
}

// ── Date helpers ───────────────────────────────────────────────────────────
const MS_DAY = 86_400_000;

/**
 * Generate a random date between `daysAgoStart` and `daysAgoEnd` days ago from now.
 */
export function randomDate(daysAgoStart: number, daysAgoEnd: number): Date {
  const now = Date.now();
  const start = now - daysAgoStart * MS_DAY;
  const end = now - daysAgoEnd * MS_DAY;
  return new Date(start + random() * (end - start));
}

/**
 * Random date in the last `days` days, biased toward recent (60% of dates in last 30% of range).
 */
export function randomDateBiased(days: number): Date {
  const now = Date.now();
  // 60% chance of being in the last 30% of the window
  if (random() < 0.6) {
    const recent = now - (days * 0.3) * MS_DAY;
    return new Date(recent + random() * (now - recent));
  }
  const start = now - days * MS_DAY;
  return new Date(start + random() * (now - start));
}

/**
 * Generate a date that's a random offset from baseDate, within [minHours, maxHours].
 */
export function dateNear(baseDate: Date, minHours: number, maxHours: number): Date {
  const offset = randInt(minHours * 60, maxHours * 60) * 60_000 * (random() > 0.5 ? 1 : -1);
  const d = new Date(baseDate.getTime() + offset);
  // Clamp to not go past now
  return d.getTime() > Date.now() ? baseDate : d;
}

/**
 * Generate a date on a specific weekday within a range, during business hours (9am-6pm).
 */
export function weekdayDate(daysAgoStart: number, daysAgoEnd: number): Date {
  const date = randomDate(daysAgoStart, daysAgoEnd);
  // Push to a weekday if weekend
  const day = date.getDay();
  if (day === 0) date.setDate(date.getDate() + 1); // Sunday → Monday
  if (day === 6) date.setDate(date.getDate() - 1); // Saturday → Friday
  // Set to business hours
  date.setHours(randInt(8, 17), randInt(0, 59), 0, 0);
  return date;
}

/**
 * Generate a "burst" of dates clustered around a central timestamp.
 * Useful for comments/likes that happen shortly after a post.
 */
export function burstDates(center: Date, count: number, spreadHours: number = 48): Date[] {
  return Array.from({ length: count }, () => {
    const offset = randFloat(-spreadHours, spreadHours) * 3_600_000;
    const d = new Date(center.getTime() + offset);
    return d.getTime() > Date.now() ? new Date(Date.now() - randInt(1, 24) * 3_600_000) : d;
  }).sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Round a date down to the start of its day (midnight UTC).
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

// ── Slug generation ────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ── Batch insert helper ────────────────────────────────────────────────────
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
