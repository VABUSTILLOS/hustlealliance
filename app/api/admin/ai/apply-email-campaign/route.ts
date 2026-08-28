import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { CampaignStatus } from '@/lib/generated/prisma/client';

const bodySchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  html: z.string().min(1),
});

/**
 * Creates a draft EmailCampaign from AI-generated email copy. For the
 * "email-sequence" kind the AI Studio UI calls this once per email in the
 * sequence, each producing its own draft campaign.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, subject, html } = parsed.data;

    const campaign = await prisma.emailCampaign.create({
      data: {
        name,
        subject,
        html,
        status: CampaignStatus.DRAFT,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/ai/apply-email-campaign]', err);
      return NextResponse.json({ error: 'Failed to create draft campaign' }, { status: 500 });
    }
  }
}
