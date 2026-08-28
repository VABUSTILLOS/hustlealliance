import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { sendCampaignEmail, instrumentHtml } from '@/lib/email/campaign-send';

// POST /api/admin/email/campaigns/[id]/test-send
// Body: { email: string } -> sends the campaign's current subject/html to a single test address.
// Does not create CampaignRecipient rows or change campaign status.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const email = body?.email as string | undefined;
    if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 });

    const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
    if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const html = instrumentHtml(campaign.html, 'test');
    const result = await sendCampaignEmail({ to: email, subject: `[TEST] ${campaign.subject}`, html });

    return NextResponse.json({ success: true, demo: !!(result && 'demo' in result && result.demo) });
  } catch (err) {
    return authErrorResponse(err);
  }
}
