import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { generateAiContent } from '@/lib/ai/generate';
import { aiGenerationKinds } from '@/lib/ai/schemas';

const bodySchema = z.object({
  kind: z.enum(aiGenerationKinds),
  prompt: z.string().min(1, 'prompt is required'),
  model: z.string().optional(),
  steer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { kind, prompt, model, steer } = parsed.data;
    const result = await generateAiContent({ kind, prompt, model, steer, createdBy: user.id });

    return NextResponse.json({
      kind,
      output: result.output,
      demo: result.demo,
      model: result.model,
      generationId: result.generationId,
    });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/ai/generate]', err);
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
  }
}
