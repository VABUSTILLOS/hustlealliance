import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { DEFAULT_MODEL, loadBrandVoiceSuffix, logAiGeneration } from '@/lib/ai/generate';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const SYSTEM_BASE =
  'You are the Hustle Alliance AI Studio assistant — a senior marketing strategist and conversion copywriter. ' +
  'Help the admin brainstorm, draft, and iterate on course outlines, product descriptions, landing page copy, and email campaigns. ' +
  'Keep answers focused and actionable. When asked to draft copy, produce ready-to-use text, not advice about the text.';

// POST /api/admin/ai/chat
// Body: { messages: ChatMessage[] } — conversational multi-turn generation.
// The last message must be from the user. Replies are logged to AiGeneration
// under kind 'chat' so they appear in generation history.
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const cleaned = messages
      .filter(
        (m) =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim(),
      )
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 8000) }));

    if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== 'user') {
      return NextResponse.json({ error: 'messages must end with a user message' }, { status: 400 });
    }

    const lastPrompt = cleaned[cleaned.length - 1].content;

    if (!process.env.AI_GATEWAY_API_KEY) {
      const reply =
        `Demo-mode reply to: "${lastPrompt.slice(0, 120)}". ` +
        'Connect AI_GATEWAY_API_KEY for real conversational generation. In the meantime, the one-shot generators on the left still work.';
      await logAiGeneration({
        kind: 'copy-rewrite',
        prompt: `[chat] ${lastPrompt}`,
        model: `${DEFAULT_MODEL} (demo)`,
        demo: true,
        output: { improved: reply, alternatives: [], rationale: 'chat demo' },
        createdBy: admin.id,
      });
      return NextResponse.json({ reply, demo: true });
    }

    const brandSuffix = await loadBrandVoiceSuffix();
    try {
      const result = await generateText({
        model: gateway(DEFAULT_MODEL),
        system: SYSTEM_BASE + brandSuffix,
        messages: cleaned,
      });
      const reply = result.text;
      await logAiGeneration({
        kind: 'copy-rewrite',
        prompt: `[chat] ${lastPrompt}`,
        model: DEFAULT_MODEL,
        demo: false,
        output: { improved: reply, alternatives: [], rationale: 'chat' },
        createdBy: admin.id,
      });
      return NextResponse.json({ reply, demo: false });
    } catch (err) {
      console.error('[ai/chat] Gateway call failed:', err);
      return NextResponse.json({ error: 'AI chat is unavailable right now.' }, { status: 502 });
    }
  } catch (err) {
    return authErrorResponse(err);
  }
}
