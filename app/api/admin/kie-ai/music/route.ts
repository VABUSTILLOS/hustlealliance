import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { createMusicTask, isKieAiConfigured, kieAiErrorResponse } from '@/lib/ai/kie-ai';

const bodySchema = z.object({
  prompt: z.string().min(1, 'prompt is required').max(4000),
  // All of the following are required by the Kie.ai music API (422 otherwise);
  // sensible defaults are applied when the caller omits them.
  customMode: z.boolean().default(false),
  instrumental: z.boolean().default(false),
  model: z
    .enum(['V3_5', 'V4', 'V4_5', 'V4_5PLUS', 'V4_5ALL', 'V5', 'V5_5'])
    .default('V4_5'),
  // Falls back to the KIEAI_CALLBACK_URL env var when not provided.
  callBackUrl: z.string().url().optional(),
});

// POST /api/admin/kie-ai/music
// Starts an async Kie.ai music generation task on POST /api/v1/generate.
// Body: { prompt, customMode?, instrumental?, model?, callBackUrl? }.
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

  const callBackUrl = parsed.data.callBackUrl ?? process.env.KIEAI_CALLBACK_URL;
  if (!callBackUrl) {
    return NextResponse.json(
      {
        error:
          'La API de música de Kie.ai exige una URL de callback. Envía "callBackUrl" en el body o configura la variable de entorno KIEAI_CALLBACK_URL.',
      },
      { status: 400 }
    );
  }

  try {
    const task = await createMusicTask({ ...parsed.data, callBackUrl });
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
