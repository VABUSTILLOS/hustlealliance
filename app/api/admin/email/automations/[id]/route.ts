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
    const { name, trigger, subject, html, delayMinutes, isActive } = body as {
      name?: string;
      trigger?: 'SIGNUP' | 'ENROLLMENT' | 'PURCHASE' | 'DRIP';
      subject?: string;
      html?: string;
      delayMinutes?: number;
      isActive?: boolean;
    };

    const automation = await prisma.emailAutomation.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(trigger !== undefined ? { trigger } : {}),
        ...(subject !== undefined ? { subject } : {}),
        ...(html !== undefined ? { html } : {}),
        ...(delayMinutes !== undefined ? { delayMinutes } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
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
