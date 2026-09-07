import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { createImageTask, isKieAiConfigured, kieAiErrorResponse } from '@/lib/ai/kie-ai';

const bodySchema = z.object({
  prompt: z.string().min(1, 'prompt is required').max(4000),
  // Required by the 4o Image API. There is no `model` field in this schema.
  size: z.enum(['1:1', '3:2', '2:3']).default('1:1'),
});

// POST /api/admin/kie-ai/image
// Starts an async Kie.ai 4o Image generation task. Body: { prompt, size? }.
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
    const task = await createImageTask(parsed.data);
    return NextResponse.json({ taskId: task.taskId });
  } catch (err) {
    try {
      return kieAiErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/kie-ai/image]', err);
      return NextResponse.json({ error: 'Failed to start image generation' }, { status: 500 });
    }
  }
}
