import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { checkDripStatus } from '@/lib/db/drip';

// GET /api/drip/check?lessonId=…&courseId=…
// Returns the drip/prerequisite status for the current user on a lesson.
// Anonymous visitors have no enrollment → treated as not drip-locked.
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const lessonId = request.nextUrl.searchParams.get('lessonId');
    const courseId = request.nextUrl.searchParams.get('courseId');

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    if (!user) {
      // Anonymous visitors can't be enrolled, so no drip/prereq lock applies.
      return NextResponse.json(
        {
          allowed: true,
          reason: 'released',
          releasesAt: null,
          missingPrerequisites: [],
        },
        { headers: { 'Cache-Control': 'private, no-cache' } }
      );
    }

    const status = await checkDripStatus(user.id, lessonId, courseId || '');
    return NextResponse.json(
      {
        allowed: status.allowed,
        reason: status.reason,
        releasesAt: status.releasesAt?.toISOString() ?? null,
        missingPrerequisites: status.missingPrerequisites,
      },
      { headers: { 'Cache-Control': 'private, no-cache' } }
    );
  } catch (err) {
    console.error('[GET /api/drip/check]', err);
    return NextResponse.json({ error: 'Failed to check drip status' }, { status: 500 });
  }
}
