import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

export async function GET() {
  try {
    await requireAdmin();
    const automations = await prisma.emailAutomation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { runs: true } } },
    });
    return NextResponse.json({ automations });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, trigger, subject, html, delayMinutes, isActive } = body as {
      name: string;
      trigger: 'SIGNUP' | 'ENROLLMENT' | 'PURCHASE' | 'DRIP';
      subject: string;
      html: string;
      delayMinutes?: number;
      isActive?: boolean;
    };

    if (!name || !trigger || !subject || !html) {
      return NextResponse.json({ error: 'name, trigger, subject, and html are required' }, { status: 400 });
    }

    const automation = await prisma.emailAutomation.create({
      data: {
        name,
        trigger,
        subject,
        html,
        delayMinutes: delayMinutes ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ automation }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}
