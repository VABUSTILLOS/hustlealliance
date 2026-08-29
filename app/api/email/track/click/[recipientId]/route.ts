import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { awardLeadScore, LEAD_SCORE_RULES } from '@/lib/scoring';

// GET /api/email/track/click/[recipientId]?url=<encoded destination>
// Marks the CampaignRecipient as CLICKED (also counts as opened) and redirects to the
// original destination URL.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recipientId: string }> },
) {
  const { recipientId } = await params;
  const url = request.nextUrl.searchParams.get('url');
  const destination = url && /^https?:\/\//.test(url) ? url : '/';

  if (recipientId !== 'test') {
    try {
      const recipient = await prisma.campaignRecipient.findUnique({
        where: { id: recipientId },
        select: { userId: true, clickedAt: true },
      });
      await prisma.campaignRecipient.updateMany({
        where: { id: recipientId },
        data: { status: 'CLICKED', clickedAt: new Date() },
      });
      // Score a click only once (repeat clicks on the same email don't re-score).
      if (recipient && !recipient.clickedAt) {
        await awardLeadScore(recipient.userId, LEAD_SCORE_RULES.emailClick);
      }
    } catch (err) {
      console.error('[Email track/click] Failed to record click:', err);
    }
  }

  return NextResponse.redirect(destination, { status: 307 });
}
