import { Resend } from 'resend';
import prisma from '@/lib/db/prisma';
import { resolveSegmentFilter, type SegmentFilter } from '@/lib/email/segments';
import { getEmailSender } from '@/lib/settings';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hustlealliance.vercel.app';

export const isEmailDemoMode = !resend;

/** Rewrite <a href="..."> links to go through the click-tracking redirect, and append an open-tracking pixel + unsubscribe footer. */
export function instrumentHtml(html: string, recipientId: string, userId?: string): string {
  const trackedHtml = html.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (_match, url: string) => `href="${APP_URL}/api/email/track/click/${recipientId}?url=${encodeURIComponent(url)}"`,
  );
  const pixel = `<img src="${APP_URL}/api/email/track/open/${recipientId}" width="1" height="1" alt="" style="display:none" />`;
  const unsubscribeUrl = `${APP_URL}/api/email/unsubscribe?u=${encodeURIComponent(userId ?? recipientId)}`;
  const footer = `<p style="margin-top:24px;font-size:11px;color:#999;text-align:center">
    <a href="${unsubscribeUrl}" style="color:#999">Unsubscribe</a> from these emails.
  </p>`;
  return `${trackedHtml}${footer}${pixel}`;
}

export async function sendCampaignEmail(params: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[Email/Campaign] DEMO → ${params.to}: "${params.subject}"`);
    return { id: `demo_${Date.now()}`, demo: true };
  }
  try {
    const sender = await getEmailSender();
    const from = sender.fromName ? `${sender.fromName} <${sender.fromEmail}>` : sender.fromEmail;
    const { data, error } = await resend.emails.send({
      from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    });
    if (error) {
      console.error('[Email/Campaign] Resend error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('[Email/Campaign] Send failed:', err);
    return null;
  }
}

/** Simple sequential batch sender with a small delay to respect rate limits. */
export async function sendBatch<T>(
  items: T[],
  sender: (item: T) => Promise<void>,
  delayMs = 120,
): Promise<void> {
  for (const item of items) {
    await sender(item);
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  }
}

/** Shape stored at SiteSetting key `abtest:<campaignId>` to track an A/B subject test. */
export type AbTestState = {
  /** userId -> 'A' | 'B' for every recipient included in the initial sample. */
  variantByUserId: Record<string, 'A' | 'B'>;
  decidedAt: string; // ISO timestamp the sample batch was sent
  winner?: 'A' | 'B';
  winnerDecidedAt?: string;
};

export function abTestSettingKey(campaignId: string): string {
  return `abtest:${campaignId}`;
}

/**
 * Execute (or resume) a campaign send. Reused by the manual "send now" API route and by the
 * scheduled-campaigns cron so both paths share identical behavior.
 *
 * Handles the optional A/B subject test: when `variantSubjectB` + `abTestSize` are set, only a
 * random sample of the segment (split 50/50 between subject A/B) is sent immediately; the
 * remainder stays PENDING and the campaign remains in SENDING status until the cron later
 * evaluates the winner and sends the rest (see app/api/cron/automations or scheduled-campaigns).
 */
export async function executeCampaignSend(campaignId: string): Promise<{
  sentCount: number;
  failedCount: number;
  skippedUnsubscribed: number;
  total: number;
  abTestStarted: boolean;
}> {
  const campaign = await prisma.emailCampaign.findUniqueOrThrow({ where: { id: campaignId } });

  const where = resolveSegmentFilter(campaign.segmentFilter as SegmentFilter | null);
  const recipients = await prisma.user.findMany({ where, select: { id: true, email: true } });

  if (recipients.length === 0) {
    throw new Error('No recipients match this segment');
  }

  await prisma.emailCampaign.update({ where: { id: campaignId }, data: { status: 'SENDING' } });

  // Create-or-fetch CampaignRecipient rows (idempotent against re-runs).
  await prisma.campaignRecipient.createMany({
    data: recipients.map((r) => ({ campaignId, userId: r.id })),
    skipDuplicates: true,
  });

  let recipientRows = await prisma.campaignRecipient.findMany({
    where: { campaignId, status: 'PENDING' },
    include: { user: { select: { email: true, emailUnsubscribed: true } } },
  });

  const abTestStarted = Boolean(campaign.variantSubjectB && campaign.abTestSize);
  const variantByUserId: Record<string, 'A' | 'B'> = {};

  if (abTestStarted) {
    const pct = Math.min(Math.max(campaign.abTestSize ?? 20, 1), 100);
    const sampleSize = Math.max(1, Math.round((recipientRows.length * pct) / 100));
    const shuffled = [...recipientRows].sort(() => Math.random() - 0.5);
    const sample = shuffled.slice(0, sampleSize);
    const half = Math.ceil(sample.length / 2);
    sample.forEach((row, i) => {
      variantByUserId[row.userId] = i < half ? 'A' : 'B';
    });
    recipientRows = sample;

    await prisma.siteSetting.upsert({
      where: { key: abTestSettingKey(campaignId) },
      create: { key: abTestSettingKey(campaignId), value: { variantByUserId, decidedAt: new Date().toISOString() } },
      update: { value: { variantByUserId, decidedAt: new Date().toISOString() } },
    });
  }

  let sentCount = 0;
  let failedCount = 0;
  let skippedUnsubscribed = 0;

  await sendBatch(recipientRows, async (row) => {
    if (row.user.emailUnsubscribed) {
      await prisma.campaignRecipient.update({ where: { id: row.id }, data: { status: 'FAILED' } });
      skippedUnsubscribed++;
      return;
    }
    if (!row.user.email) {
      await prisma.campaignRecipient.update({ where: { id: row.id }, data: { status: 'FAILED' } });
      failedCount++;
      return;
    }
    try {
      const subject =
        abTestStarted && variantByUserId[row.userId] === 'B' && campaign.variantSubjectB
          ? campaign.variantSubjectB
          : campaign.subject;
      const html = instrumentHtml(campaign.html, row.id, row.userId);
      const result = await sendCampaignEmail({ to: row.user.email, subject, html });
      if (result) {
        await prisma.campaignRecipient.update({
          where: { id: row.id },
          data: { status: 'SENT', sentAt: new Date() },
        });
        sentCount++;
      } else {
        await prisma.campaignRecipient.update({ where: { id: row.id }, data: { status: 'FAILED' } });
        failedCount++;
      }
    } catch (err) {
      console.error(`[Campaign send] Failed for recipient ${row.id}:`, err);
      await prisma.campaignRecipient.update({ where: { id: row.id }, data: { status: 'FAILED' } });
      failedCount++;
    }
  });

  // Non-A/B campaigns are fully sent in one pass; A/B campaigns stay SENDING until the
  // remainder is sent by the cron once a winner is decided.
  if (!abTestStarted) {
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { status: 'SENT', sentAt: new Date() },
    });
  }

  return { sentCount, failedCount, skippedUnsubscribed, total: recipientRows.length, abTestStarted };
}

/**
 * Send the remainder of an A/B campaign's recipients using the winning subject, and mark the
 * campaign SENT. Called by the cron once the sample has had time to accrue opens.
 */
export async function sendCampaignRemainder(
  campaignId: string,
  winner: 'A' | 'B',
): Promise<{ sentCount: number; failedCount: number; skippedUnsubscribed: number }> {
  const campaign = await prisma.emailCampaign.findUniqueOrThrow({ where: { id: campaignId } });
  const subject = winner === 'B' && campaign.variantSubjectB ? campaign.variantSubjectB : campaign.subject;

  const recipientRows = await prisma.campaignRecipient.findMany({
    where: { campaignId, status: 'PENDING' },
    include: { user: { select: { email: true, emailUnsubscribed: true } } },
  });

  let sentCount = 0;
  let failedCount = 0;
  let skippedUnsubscribed = 0;

  await sendBatch(recipientRows, async (row) => {
    if (row.user.emailUnsubscribed) {
      await prisma.campaignRecipient.update({ where: { id: row.id }, data: { status: 'FAILED' } });
      skippedUnsubscribed++;
      return;
    }
    if (!row.user.email) {
      await prisma.campaignRecipient.update({ where: { id: row.id }, data: { status: 'FAILED' } });
      failedCount++;
      return;
    }
    try {
      const html = instrumentHtml(campaign.html, row.id, row.userId);
      const result = await sendCampaignEmail({ to: row.user.email, subject, html });
      if (result) {
        await prisma.campaignRecipient.update({
          where: { id: row.id },
          data: { status: 'SENT', sentAt: new Date() },
        });
        sentCount++;
      } else {
        await prisma.campaignRecipient.update({ where: { id: row.id }, data: { status: 'FAILED' } });
        failedCount++;
      }
    } catch (err) {
      console.error(`[Campaign remainder send] Failed for recipient ${row.id}:`, err);
      await prisma.campaignRecipient.update({ where: { id: row.id }, data: { status: 'FAILED' } });
      failedCount++;
    }
  });

  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: { status: 'SENT', sentAt: new Date() },
  });

  return { sentCount, failedCount, skippedUnsubscribed };
}
