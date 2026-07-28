import { NextRequest, NextResponse } from 'next/server';
import { updateVideoPosition } from '@/lib/db/progress';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/progress/video-position — save video watch position
// Body: { lessonId: string, positionSeconds: number }
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const { lessonId, positionSeconds } = await request.json();
    if (!lessonId || typeof positionSeconds !== 'number') {
      return NextResponse.json(
        { error: 'lessonId (string) and positionSeconds (number) are required' },
        { status: 400 }
      );
    }

    const progress = await updateVideoPosition(user.id, lessonId, positionSeconds);
    return NextResponse.json({ progress });
  } catch (error) {
    console.error('[POST /api/progress/video-position] Error:', error);
    return NextResponse.json({ error: 'Failed to update video position' }, { status: 500 });
  }
}
