import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

// DELETE /api/admin/email/templates/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.emailTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}
