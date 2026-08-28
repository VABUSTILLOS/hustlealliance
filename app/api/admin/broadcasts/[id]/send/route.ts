import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse, AuthError } from '@/lib/auth/guard';
import { sendBroadcast } from '@/lib/db/broadcasts';

// POST /api/admin/broadcasts/[id]/send — send a broadcast immediately.
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const broadcast = await sendBroadcast(id);
    return NextResponse.json({ broadcast });
  } catch (err) {
    if (err instanceof AuthError) return authErrorResponse(err);
    if (err instanceof Error) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }
}
