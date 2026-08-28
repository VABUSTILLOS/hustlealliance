import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { resolveSegmentFilter, type SegmentFilter } from '@/lib/email/segments';
import { sendCampaignEmail, instrumentHtml, sendBatch } from '@/lib/email/campaign-send';

// POST /api/admin/email/campaigns/[id]/send
// Resolves the segment filter, creates CampaignRecipient rows (idempotent), sends via
// Resend (or demo-logs), and marks the campaign SENDING -> SENT.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
    if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (campaign.status === 'SENDING' || campaign.status === 'SENT') {
      return NextResponse.json({ error: `Campaign already ${campaign.status.toLowerCase()}` }, { status: 400 });
    }

    const where = resolveSegmentFilter(campaign.segmentFilter as SegmentFilter | null);
    const recipients = await prisma.user.findMany({ where, select: { id: true, email: true } });

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients match this segment' }, { status: 400 });
    }

    await prisma.emailCampaign.update({ where: { id }, data: { status: 'SENDING' } });

    // Create-or-fetch CampaignRecipient rows (idempotent against re-runs).
    await prisma.campaignRecipient.createMany({
      data: recipients.map((r) => ({ campaignId: id, userId: r.id })),
      skipDuplicates: true,
    });

    const recipientRows = await prisma.campaignRecipient.findMany({
      where: { campaignId: id, status: 'PENDING' },
      include: { user: { select: { email: true } } },
    });

    let sentCount = 0;
    let failedCount = 0;

    await sendBatch(recipientRows, async (row) => {
      if (!row.user.email) {
        await prisma.campaignRecipient.update({ where: { id: row.id }, data: { status: 'FAILED' } });
        failedCount++;
        return;
      }
      try {
        const html = instrumentHtml(campaign.html, row.id);
        const result = await sendCampaignEmail({ to: row.user.email, subject: campaign.subject, html });
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

    await prisma.emailCampaign.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date() },
    });

    return NextResponse.json({ success: true, sentCount, failedCount, total: recipientRows.length });
  } catch (err) {
    return authErrorResponse(err);
  }
}
