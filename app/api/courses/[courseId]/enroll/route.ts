import { NextRequest, NextResponse } from 'next/server';
import { enrollUser, getEnrollment } from '@/lib/db/courses';
import { checkAccess } from '@/lib/auth/accessControl';
import { createClient } from '@/lib/supabase/server';
import { notifyCourseEnrollment } from '@/lib/notifications/service';
import prisma from '@/lib/db/prisma';

// POST /api/courses/[courseId]/enroll — enroll the current user in a course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    // Get the authenticated user from Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if already enrolled
    const existing = await getEnrollment(user.id, courseId);
    if (existing) {
      return NextResponse.json(
        { enrollment: existing, message: 'Already enrolled' },
        { status: 200 }
      );
    }

    // Enforce access control — refuse enrollment if the user doesn't have
    // sufficient tier or an à la carte entitlement for this course
    const access = await checkAccess({ userId: user.id, courseId });
    if (!access.allowed) {
      return NextResponse.json(
        {
          error: 'Access denied',
          requiredTier: access.requiredTier,
          userTier: access.userTier,
          upgradeOptions: access.upgradeOptions,
        },
        { status: 403 }
      );
    }

    const enrollment = await enrollUser(user.id, courseId);

    // Fire enrollment notification (async, don't block)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, slug: true },
    });
    if (course && user.email) {
      notifyCourseEnrollment(user.id, user.email, course.title, course.slug).catch(() => {});
    }

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/courses/enroll] Error:', error);
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
  }
}
