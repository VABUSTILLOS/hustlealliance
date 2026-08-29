import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { sendEmail } from '@/lib/email/resend';

// POST /api/admin/email/automations/[id]/test-send
// Body: { stepOrder?: number; to?: string }
// Sends a single automation step to the admin (or the given address) for preview.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = (await request.json().catch(() => ({}))) as { stepOrder?: number; to?: string };

    const automation = await prisma.emailAutomation.findUnique({
      where: { id },
      include: { steps: { orderBy: { order: 'asc' } } },
    });
    if (!automation) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const step =
      automation.steps.find((s) => s.order === (body.stepOrder ?? 0)) ??
      (automation.steps.length === 0
        ? { order: 0, subject: automation.subject, html: automation.html }
        : null);
    if (!step) {
      return NextResponse.json({ error: `No step with order ${body.stepOrder ?? 0}` }, { status: 400 });
    }

    const to = typeof body.to === 'string' && body.to.includes('@') ? body.to.trim() : admin.email;
    const result = await sendEmail({
      to,
      subject: `[TEST] ${step.subject}`,
      html: step.html,
    });
    if (!result) return NextResponse.json({ error: 'Send failed' }, { status: 500 });

    return NextResponse.json({ sent: true, to, stepOrder: step.order });
  } catch (err) {
    return authErrorResponse(err);
  }
}
