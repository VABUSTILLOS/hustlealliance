import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { updateUserRole } from '@/lib/db/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateUserRole(id, body);

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error('[PUT /api/admin/users/[id]]', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
