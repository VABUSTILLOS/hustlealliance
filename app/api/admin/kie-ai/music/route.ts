import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { createMusicTask, isKieAiConfigured, kieAiErrorResponse } from '@/lib/ai/kie-ai';

const bodySchema = z.object({
  prompt: z.string().min(1, 'prompt is required').max(4000),
  model: z.string().optional(),
});

// POST /api/admin/kie-ai/music
// Starts an async Kie.ai music generation task. Body: { prompt, model? }.
// Returns { taskId }; poll GET /api/admin/kie-ai/status?taskId=... for the result.
export async function POST(request: NextRequest) {
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

  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const task = await createMusicTask(parsed.data);
    return NextResponse.json({ taskId: task.taskId });
  } catch (err) {
    try {
      return kieAiErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/kie-ai/music]', err);
      return NextResponse.json({ error: 'Failed to start music generation' }, { status: 500 });
    }
  }
}
