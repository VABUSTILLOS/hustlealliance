import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

// POST /api/admin/email/contacts/[id]/notes
// Body: { body: string } — adds an internal CRM note to a contact.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { body } = (await request.json()) as { body?: string };
    if (!body || !body.trim()) {
      return NextResponse.json({ error: 'body is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const note = await prisma.contactNote.create({
      data: { userId: id, authorId: admin.id, body: body.trim().slice(0, 4000) },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// DELETE /api/admin/email/contacts/[id]/notes?noteId=
// Removes a note (any admin may delete; notes are internal-only).
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const noteId = request.nextUrl.searchParams.get('noteId');
    if (!noteId) return NextResponse.json({ error: 'noteId is required' }, { status: 400 });

    await prisma.contactNote.deleteMany({ where: { id: noteId, userId: id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}
