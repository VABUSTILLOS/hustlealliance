import { NextRequest, NextResponse } from 'next/server';
import { getUserGamification, getUserCertificates } from '@/lib/db/progress';
import { createClient } from '@/lib/supabase/server';

// GET /api/progress/gamification — get user's XP, badges, and streak
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [gamification, certificates] = await Promise.all([
      getUserGamification(user.id),
      getUserCertificates(user.id),
    ]);

    return NextResponse.json({ ...gamification, certificates });
  } catch (error) {
    console.error('[GET /api/progress/gamification] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch gamification' }, { status: 500 });
  }
}
