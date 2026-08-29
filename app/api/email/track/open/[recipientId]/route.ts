import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { awardLeadScore, LEAD_SCORE_RULES } from '@/lib/scoring';

const PIXEL_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7',
  'base64',
);

// GET /api/email/track/open/[recipientId]
// Returns a 1x1 transparent gif and marks the CampaignRecipient as OPENED.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ recipientId: string }> },
) {
  const { recipientId } = await params;

  if (recipientId !== 'test') {
    try {
      const updated = await prisma.campaignRecipient.updateMany({
        where: { id: recipientId, status: { in: ['SENT'] } },
        data: { status: 'OPENED', openedAt: new Date() },
      });
      if (updated.count > 0) {
        const recipient = await prisma.campaignRecipient.findUnique({
          where: { id: recipientId },
          select: { userId: true },
        });
        if (recipient) await awardLeadScore(recipient.userId, LEAD_SCORE_RULES.emailOpen);
      }
    } catch (err) {
      console.error('[Email track/open] Failed to record open:', err);
    }
  }

  return new NextResponse(PIXEL_GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    },
  });
}
