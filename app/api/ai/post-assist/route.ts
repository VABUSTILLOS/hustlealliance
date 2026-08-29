import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/user';
import { authErrorResponse, AuthError } from '@/lib/auth/guard';
import { generateAiContent } from '@/lib/ai/generate';

const bodySchema = z.object({
  text: z.string().min(1, 'text is required').max(2000),
});

// POST /api/ai/post-assist — member-facing AI post polish for the composer.
// Requires a signed-in member (not admin-only). Reuses the AI Studio infra
// (generateAiContent / post-polish kind) and logs to AiGeneration.
export async function POST(request: NextRequest) {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    return authErrorResponse(err);
  }
  if (!user) {
    return authErrorResponse(new AuthError(401, 'Sign in to use AI assist'));
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await generateAiContent({
      kind: 'post-polish',
      prompt: parsed.data.text,
      createdBy: user.id,
    });
    return NextResponse.json({
      output: result.output,
      demo: result.demo,
      model: result.model,
    });
  } catch (err) {
    console.error('[POST /api/ai/post-assist]', err);
    return NextResponse.json({ error: 'Failed to polish post' }, { status: 500 });
  }
}
