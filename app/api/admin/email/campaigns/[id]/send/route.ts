import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { executeCampaignSend } from '@/lib/email/campaign-send';

// POST /api/admin/email/campaigns/[id]/send
// Resolves the segment filter, creates CampaignRecipient rows (idempotent), sends via
// Resend (or demo-logs), and marks the campaign SENDING -> SENT. When the campaign has an
// A/B subject test configured, only the sample batch is sent here; the remainder is sent
// later by the cron once a winning subject is decided (see executeCampaignSend).
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

    const result = await executeCampaignSend(id);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err instanceof Error && err.message === 'No recipients match this segment') {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return authErrorResponse(err);
  }
}
