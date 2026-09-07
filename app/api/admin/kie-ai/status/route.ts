import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { getTaskStatus, isKieAiConfigured, kieAiErrorResponse, extractResultUrls } from '@/lib/ai/kie-ai';

// GET /api/admin/kie-ai/status?taskId=...
// One-shot status check for an async Kie.ai task (image/video/music), shared
// across the three generation routes. Poll this from the client instead of
// blocking a serverless function on the whole generation.
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  if (!isKieAiConfigured()) {
    return NextResponse.json(
      { error: 'KIE_AI_API_KEY is not configured. See .env.example / KIE_AI_PILOT.md.' },
      { status: 500 }
    );
  }

  const taskId = request.nextUrl.searchParams.get('taskId');
  if (!taskId) {
    return NextResponse.json({ error: 'taskId query param is required' }, { status: 400 });
  }

  try {
    const record = await getTaskStatus(taskId);
    // Surface generated asset URLs alongside the raw record, whether the API
    // returned them at the top level or nested inside `resultJson`.
    return NextResponse.json({ ...record, resultUrls: extractResultUrls(record) });
  } catch (err) {
    try {
      return kieAiErrorResponse(err);
    } catch {
      console.error('[GET /api/admin/kie-ai/status]', err);
      return NextResponse.json({ error: 'Failed to fetch task status' }, { status: 500 });
    }
  }
}
