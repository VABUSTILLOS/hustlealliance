import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse, AuthError } from '@/lib/auth/guard';
import { scheduleBroadcast } from '@/lib/db/broadcasts';

// POST /api/admin/broadcasts/[id]/schedule — body: { scheduledAt: ISO string }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { scheduledAt } = body as { scheduledAt?: string };
    if (!scheduledAt) return NextResponse.json({ error: 'scheduledAt is required' }, { status: 400 });
    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: 'scheduledAt is not a valid date' }, { status: 400 });
    }
    const broadcast = await scheduleBroadcast(id, date);
    return NextResponse.json({ broadcast });
  } catch (err) {
    if (err instanceof AuthError) return authErrorResponse(err);
    if (err instanceof Error) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }
}
