import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { chatCompletion, isKieAiConfigured, kieAiErrorResponse } from '@/lib/ai/kie-ai';

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string().min(1),
      })
    )
    .min(1, 'messages is required'),
  model: z.string().min(1, 'model is required'),
  temperature: z.number().min(0).max(2).optional(),
});

// POST /api/admin/kie-ai/chat
// Synchronous, OpenAI-compatible LLM call via Kie.ai. Body: { messages, model, temperature? }.
// Returns { content }.
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
    const result = await chatCompletion(parsed.data);
    return NextResponse.json({ content: result.content });
  } catch (err) {
    try {
      return kieAiErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/kie-ai/chat]', err);
      return NextResponse.json({ error: 'Failed to generate chat completion' }, { status: 500 });
    }
  }
}
