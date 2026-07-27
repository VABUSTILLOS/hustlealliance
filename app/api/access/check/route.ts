import { NextRequest, NextResponse } from 'next/server';
import { checkAccess } from '@/lib/auth/accessControl';
import { createClient } from '@/lib/supabase/server';

// GET /api/access/check?courseId=xxx&lessonId=yyy
// Check if the current user can access specific content.
// Returns { allowed, reason, requiredTier, userTier, upgradeOptions }
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const courseId = searchParams.get('courseId') || undefined;
    const lessonId = searchParams.get('lessonId') || undefined;

    if (!courseId && !lessonId) {
      return NextResponse.json(
        { error: 'courseId or lessonId is required' },
        { status: 400 }
      );
    }

    const result = await checkAccess({
      userId: user.id,
      courseId,
      lessonId,
    });

    return NextResponse.json(result, {
      headers: {
        // Don't cache access checks — they depend on user state
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[GET /api/access/check] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check access' },
      { status: 500 }
    );
  }
}
