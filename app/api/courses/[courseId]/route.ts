import { NextRequest, NextResponse } from 'next/server';
import { getCourseById, getCourseBySlug } from '@/lib/db/courses';
import { getCurrentUser } from '@/lib/auth/user';
import { checkAccess } from '@/lib/auth/accessControl';

// GET /api/courses/[courseId] — get a single course (by UUID or slug) with modules and lessons
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    // Try UUID first, then slug
    let course = await getCourseById(courseId);
    if (!course) {
      course = await getCourseBySlug(courseId);
    }

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // ── Access enforcement: gate lesson content behind entitlements ──
    const user = await getCurrentUser();
    const access = await checkAccess({
      userId: user?.id ?? null,
      courseId: course.id,
    });
    const isAuthorized = access.allowed;

    const redacted = isAuthorized
      ? course
      : {
          ...course,
          modules: course.modules.map((mod) => ({
            ...mod,
            lessons: mod.lessons.map((l) => ({
              ...l,
              content: l.isPreview ? l.content : null,
              videoUrl: l.isPreview ? l.videoUrl : null,
            })),
          })),
        };

    return NextResponse.json(
      { course: redacted },
      {
        headers: {
          'Cache-Control': 'private, no-cache',
        },
      }
    );
  } catch (error) {
    console.error(`[GET /api/courses/${(await params).courseId}] Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
