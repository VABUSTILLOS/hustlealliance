import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCourseDripSettings, upsertCourseDripSettings } from '@/lib/db/drip';
import prisma from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const settings = await getCourseDripSettings(courseId);
    return NextResponse.json({ settings });
  } catch (err: any) {
    console.error('GET /api/courses/[courseId]/drip error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify instructor/admin role
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!dbUser || (dbUser.role !== 'INSTRUCTOR' && dbUser.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { courseId } = await params;
  const body = await request.json();

  const settings = await upsertCourseDripSettings(courseId, {
    enabled: body.enabled,
    type: body.type,
    intervalDays: body.intervalDays,
    startDate: body.startDate ? new Date(body.startDate) : undefined,
  });

  return NextResponse.json({ settings });
}
