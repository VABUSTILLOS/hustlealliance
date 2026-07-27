import { NextRequest, NextResponse } from 'next/server';
import { getCourseById, getCourseBySlug } from '@/lib/db/courses';

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

    return NextResponse.json(
      { course },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error(`[GET /api/courses/${(await params).courseId}] Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
