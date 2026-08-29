// GET /api/access/check?courseId=&lessonId=
// Real access check backed by lib/auth/accessControl.checkAccess.
// Anonymous users are treated as FREE tier (no entitlements), so public
// content stays readable while paid content returns blocked + upgradeOptions.
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { checkAccess } from '@/lib/auth/accessControl';

export async function GET(request: NextRequest) {
  const courseId = request.nextUrl.searchParams.get('courseId') || undefined;
  const lessonId = request.nextUrl.searchParams.get('lessonId') || undefined;

  if (!courseId && !lessonId) {
    return NextResponse.json(
      { error: 'Either courseId or lessonId is required' },
      { status: 400 }
    );
  }

  const user = await getCurrentUser();
  // Anonymous → null userId. checkAccess treats this as FREE tier with no
  // entitlements or drip checks, so public content stays readable while
  // paid content is correctly blocked with upgradeOptions.
  const userId = user?.id ?? null;

  try {
    const result = await checkAccess({ userId, lessonId, courseId });
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
