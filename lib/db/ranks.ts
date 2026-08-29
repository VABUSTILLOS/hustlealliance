// ── XP → Rank / Level helpers ─────────────────────────────────────────

export interface RankInfo {
  /** Numeric level derived from total XP (1-based, increases as XP grows). */
  level: number;
  /** XP needed to reach the next level. */
  xpForNextLevel: number;
  /** Progress toward the next level, 0–1. */
  progress: number;
  /** Rank title (Rookie → Legend). */
  title: string;
  /** Icon shown next to the rank. */
  icon: string;
  /** Whether the user is within `topPercent` of the leaderboard. */
  isElite: boolean;
}

/** Rank ladder — thresholds are cumulative XP. */
const RANKS: { threshold: number; title: string; icon: string }[] = [
  { threshold: 0, title: 'Rookie', icon: '🌱' },
  { threshold: 100, title: 'Hustler', icon: '⚡' },
  { threshold: 300, title: 'Grinder', icon: '🔥' },
  { threshold: 600, title: 'Builder', icon: '🔨' },
  { threshold: 1000, title: 'Innovator', icon: '🚀' },
  { threshold: 2000, title: 'Mogul', icon: '💎' },
  { threshold: 3500, title: 'Legend', icon: '👑' },
];

/** Level formula: roughly quadratic — level N requires ~50·N² XP. */
function levelFromXp(totalXp: number): { level: number; xpForNextLevel: number; progress: number } {
  const level = Math.floor(Math.sqrt(totalXp / 50)) + 1;
  const currentFloor = 50 * (level - 1) * (level - 1);
  const nextFloor = 50 * level * level;
  const span = Math.max(1, nextFloor - currentFloor);
  const progress = Math.min(1, Math.max(0, (totalXp - currentFloor) / span));
  return { level, xpForNextLevel: nextFloor - totalXp, progress };
}

export function getRankFromXp(totalXp: number, topPercent?: number): RankInfo {
  const { level, xpForNextLevel, progress } = levelFromXp(totalXp);
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (totalXp >= r.threshold) rank = r;
  }
  return {
    level,
    xpForNextLevel,
    progress,
    title: rank.title,
    icon: rank.icon,
    isElite: topPercent !== undefined && topPercent > 0 && topPercent <= 10,
  };
}
