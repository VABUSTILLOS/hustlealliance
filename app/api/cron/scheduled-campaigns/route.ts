import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { executeCampaignSend, sendCampaignRemainder, type AbTestState } from '@/lib/email/campaign-send';

// GET /api/cron/scheduled-campaigns
// Runs every few minutes (see vercel.json). Handles two things:
//  1. Campaigns with status=SCHEDULED and scheduledAt <= now: execute the send (reuses the
//     same executeCampaignSend flow as the manual "send now" API).
//  2. Campaigns in SENDING with an A/B subject test whose sample was sent >= 4h ago: pick the
//     winning subject (higher open rate) and send the remainder of the segment.
const AB_TEST_DECISION_DELAY_MS = 4 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    // 1. Send due scheduled campaigns.
    const dueCampaigns = await prisma.emailCampaign.findMany({
      where: { status: 'SCHEDULED', scheduledAt: { lte: now } },
    });

    let campaignsSent = 0;
    let campaignsFailed = 0;

    for (const campaign of dueCampaigns) {
      try {
        await executeCampaignSend(campaign.id);
        campaignsSent++;
      } catch (err) {
        console.error(`[CRON /scheduled-campaigns] Send failed for campaign ${campaign.id}:`, err);
        await prisma.emailCampaign.update({ where: { id: campaign.id }, data: { status: 'DRAFT' } });
        campaignsFailed++;
      }
    }

    // 2. Evaluate A/B tests ready for a winner decision.
    const sendingCampaigns = await prisma.emailCampaign.findMany({
      where: { status: 'SENDING', variantSubjectB: { not: null } },
    });

    let abTestsDecided = 0;

    for (const campaign of sendingCampaigns) {
      const setting = await prisma.siteSetting.findUnique({ where: { key: `abtest:${campaign.id}` } });
      if (!setting) continue;
      const state = setting.value as AbTestState;
      if (state.winner) continue; // already decided

      const decidedAt = new Date(state.decidedAt);
      if (now.getTime() - decidedAt.getTime() < AB_TEST_DECISION_DELAY_MS) continue;

      const sampleUserIds = Object.keys(state.variantByUserId);
      if (sampleUserIds.length === 0) continue;

      const sampleRecipients = await prisma.campaignRecipient.findMany({
        where: { campaignId: campaign.id, userId: { in: sampleUserIds } },
        select: { userId: true, status: true, openedAt: true },
      });

      const rate = (variant: 'A' | 'B') => {
        const group = sampleRecipients.filter((r) => state.variantByUserId[r.userId] === variant);
        const sent = group.filter((r) => r.status !== 'PENDING' && r.status !== 'FAILED').length;
        const opened = group.filter((r) => r.openedAt !== null).length;
        return sent > 0 ? opened / sent : 0;
      };

      const winner: 'A' | 'B' = rate('B') > rate('A') ? 'B' : 'A';

      await sendCampaignRemainder(campaign.id, winner);

      await prisma.siteSetting.update({
        where: { key: `abtest:${campaign.id}` },
        data: { value: { ...state, winner, winnerDecidedAt: now.toISOString() } },
      });
      abTestsDecided++;
    }

    return NextResponse.json({ success: true, campaignsSent, campaignsFailed, abTestsDecided });
  } catch (error) {
    console.error('[CRON /scheduled-campaigns] Error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
