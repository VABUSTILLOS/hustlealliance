import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { logAdminActivity } from '@/lib/activity';

export async function GET() {
  try {
    await requireAdmin();
    const automations = await prisma.emailAutomation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { runs: true } }, steps: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json({ automations });
  } catch (err) {
    return authErrorResponse(err);
  }
}

type StepInput = { order: number; subject: string; html: string; delayMinutes: number };

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();
    const { name, trigger, subject, html, delayMinutes, isActive, steps } = body as {
      name: string;
      trigger: 'SIGNUP' | 'ENROLLMENT' | 'PURCHASE' | 'DRIP' | 'TAG_ADDED' | 'LEAD_CAPTURED' | 'ABANDONED_CART';
      subject: string;
      html: string;
      delayMinutes?: number;
      isActive?: boolean;
      steps?: StepInput[];
    };

    if (!name || !trigger || !subject || !html) {
      return NextResponse.json({ error: 'name, trigger, subject, and html are required' }, { status: 400 });
    }

    // Legacy subject/html/delayMinutes fields stay populated from the first step for back-compat
    // with any code path that still reads them directly (e.g. single-step automations).
    const firstStep = steps?.[0];

    const automation = await prisma.emailAutomation.create({
      data: {
        name,
        trigger,
        subject: firstStep?.subject ?? subject,
        html: firstStep?.html ?? html,
        delayMinutes: firstStep?.delayMinutes ?? delayMinutes ?? 0,
        isActive: isActive ?? true,
        ...(steps?.length
          ? {
              steps: {
                create: steps.map((s, i) => ({
                  order: i,
                  subject: s.subject,
                  html: s.html,
                  delayMinutes: s.delayMinutes ?? 0,
                })),
              },
            }
          : {}),
      },
      include: { steps: { orderBy: { order: 'asc' } } },
    });

    await logAdminActivity({ actorId: user.id, action: 'automation.create', entity: 'EmailAutomation', entityId: automation.id, meta: { name: automation.name, trigger: automation.trigger } });
    return NextResponse.json({ automation }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}
