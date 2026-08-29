import { prisma } from '@/lib/db/prisma';
import type { Prisma } from '@/lib/generated/prisma/client';

/**
 * Append an entry to the admin audit log. Fire-and-forget safe: never throws.
 *
 * Conventions:
 * - action: "<entity>.<verb>", e.g. "product.create", "order.refund", "payout.markPaid"
 * - entity: model name, e.g. "Product", "EmailCampaign", "LandingPage"
 */
export async function logAdminActivity(input: {
  actorId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    if (!input.actorId || !input.action || !input.entity) return;
    await prisma.adminActivity.create({
      data: {
        actorId: input.actorId,
        action: input.action.slice(0, 120),
        entity: input.entity.slice(0, 60),
        entityId: input.entityId ?? null,
        meta: (input.meta ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (err) {
    console.error('[activity] failed to log admin activity', err);
  }
}
