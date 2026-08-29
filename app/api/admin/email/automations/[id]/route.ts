import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { name, trigger, subject, html, delayMinutes, isActive, steps } = body as {
      name?: string;
      trigger?: 'SIGNUP' | 'ENROLLMENT' | 'PURCHASE' | 'DRIP' | 'TAG_ADDED' | 'LEAD_CAPTURED' | 'ABANDONED_CART';
      subject?: string;
      html?: string;
      delayMinutes?: number;
      isActive?: boolean;
      steps?: { order: number; subject: string; html: string; delayMinutes: number }[];
    };

    const firstStep = steps?.[0];

    const automation = await prisma.emailAutomation.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(trigger !== undefined ? { trigger } : {}),
        ...(subject !== undefined ? { subject: firstStep?.subject ?? subject } : firstStep ? { subject: firstStep.subject } : {}),
        ...(html !== undefined ? { html: firstStep?.html ?? html } : firstStep ? { html: firstStep.html } : {}),
        ...(delayMinutes !== undefined
          ? { delayMinutes: firstStep?.delayMinutes ?? delayMinutes }
          : firstStep
            ? { delayMinutes: firstStep.delayMinutes ?? 0 }
            : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(steps !== undefined
          ? {
              steps: {
                deleteMany: {},
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

    return NextResponse.json({ automation });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.emailAutomation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}
