import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { createVideoTask, isKieAiConfigured, kieAiErrorResponse } from '@/lib/ai/kie-ai';

const bodySchema = z.object({
  prompt: z.string().min(1, 'prompt is required').max(4000),
  // Required by the Veo API — always sent, defaulted when the caller omits it.
  model: z.string().min(1).default('veo3_fast'),
  aspect_ratio: z.string().min(1).default('16:9'),
});

// POST /api/admin/kie-ai/video
// Starts an async Kie.ai Veo video generation task. Body: { prompt, model?, aspect_ratio? }.
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
    const task = await createVideoTask(parsed.data);
    return NextResponse.json({ taskId: task.taskId });
  } catch (err) {
    try {
      return kieAiErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/kie-ai/video]', err);
      return NextResponse.json({ error: 'Failed to start video generation' }, { status: 500 });
    }
  }
}
