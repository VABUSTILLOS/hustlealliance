import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

// GET /api/admin/email/templates — list saved campaign templates (gallery).
export async function GET() {
  try {
    await requireAdmin();
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ templates });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// POST /api/admin/email/templates — save a campaign (or ad-hoc subject+html) as a template.
// Body: { name: string; subject: string; html: string }
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { name, subject, html } = (await request.json()) as {
      name?: string;
      subject?: string;
      html?: string;
    };
    if (!name?.trim() || !subject || !html) {
      return NextResponse.json({ error: 'name, subject, and html are required' }, { status: 400 });
    }
    const template = await prisma.emailTemplate.create({
      data: { name: name.trim().slice(0, 200), subject, html },
    });
    return NextResponse.json({ template }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}
