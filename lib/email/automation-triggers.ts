import prisma from '@/lib/db/prisma';
import type { AutomationTrigger } from '@/lib/generated/prisma/client';

/**
 * Enroll a user into every active automation matching `trigger`.
 * Idempotent per (automation, user): skips automations the user already has a run for.
 * Event-driven counterpart to the cron scanner — call this at the moment the
 * triggering event occurs (tag added, lead captured, cart abandoned).
 * Never throws: automation enrollment must not break the primary flow.
 */
export async function enrollUserInAutomations(
  userId: string,
  trigger: AutomationTrigger,
  eventAt: Date = new Date(),
): Promise<void> {
  try {
    const automations = await prisma.emailAutomation.findMany({
      where: { isActive: true, trigger },
      select: { id: true, delayMinutes: true },
    });
    if (automations.length === 0) return;

    const existing = await prisma.automationRun.findMany({
      where: { userId, automationId: { in: automations.map((a) => a.id) } },
      select: { automationId: true },
    });
    const alreadyEnrolled = new Set(existing.map((r) => r.automationId));

    for (const automation of automations) {
      if (alreadyEnrolled.has(automation.id)) continue;
      await prisma.automationRun.create({
        data: {
          automationId: automation.id,
          userId,
          runAt: new Date(eventAt.getTime() + automation.delayMinutes * 60 * 1000),
        },
      });
    }
  } catch (err) {
    console.error(`[automations] enrollment failed for trigger ${trigger}:`, err);
  }
}
