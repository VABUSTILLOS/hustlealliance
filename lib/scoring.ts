import { prisma } from '@/lib/db/prisma';

/** Lead scoring rules (points per event). */
export const LEAD_SCORE_RULES = {
  pageView: 1,
  emailOpen: 5,
  emailClick: 10,
  leadCaptured: 15,
  purchase: 50,
} as const;

/**
 * Increment a contact's lead score. Fire-and-forget safe: never throws.
 * Silently no-ops if the user doesn't exist.
 */
export async function awardLeadScore(userId: string, points: number): Promise<void> {
  try {
    if (!userId || !points) return;
    await prisma.user.update({
      where: { id: userId },
      data: { leadScore: { increment: points } },
    });
  } catch (err) {
    console.error('[scoring] failed to award points', err);
  }
}
