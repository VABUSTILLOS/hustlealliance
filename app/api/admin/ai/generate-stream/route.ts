import { NextRequest } from 'next/server';
import { z } from 'zod';
import { streamText, Output } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { aiGenerationKinds, schemaByKind, type OutputForKind } from '@/lib/ai/schemas';
import { demoOutputForKind } from '@/lib/ai/demo';
import {
  DEFAULT_MODEL,
  systemPromptByKind,
  loadBrandVoiceSuffix,
  buildPrompt,
  logAiGeneration,
  isAiDemoForced,
  hasAiGatewayAuth,
} from '@/lib/ai/generate';

const bodySchema = z.object({
  kind: z.enum(aiGenerationKinds),
  prompt: z.string().min(1, 'prompt is required'),
  model: z.string().optional(),
  steer: z.string().optional(),
});

/**
 * Streams AI Studio generation progress as newline-delimited JSON events:
 *   {"type":"partial","output":{...}}   — partial (possibly incomplete) output as it streams in
 *   {"type":"done","output":{...},"demo":bool,"model":"...","generationId":"..."} — final validated output
 *   {"type":"error","error":"..."}
 *
 * Demo mode (no AI_GATEWAY_API_KEY) simulates the same event shape by chunking
 * the deterministic demo output, so the client code path is identical either way.
 */
export async function POST(request: NextRequest) {
  let user;
  try {
    user = await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid request body', details: parsed.error.flatten() }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { kind, prompt, model: requestedModel, steer } = parsed.data;
  const model = requestedModel || DEFAULT_MODEL;
  const finalPrompt = buildPrompt(prompt, steer);
  const hasGatewayKey = hasAiGatewayAuth();
  const forceDemo = await isAiDemoForced();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: object) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      let finalOutput: OutputForKind<typeof kind>;
      let demo = false;

      try {
        if (!hasGatewayKey || forceDemo) {
          demo = true;
          const demoOutput = demoOutputForKind(kind, finalPrompt);
          // Simulate progressive streaming so the client's UI code path matches live mode.
          const rawJson = JSON.stringify(demoOutput);
          const chunkSize = Math.max(20, Math.ceil(rawJson.length / 12));
          for (let i = 0; i < rawJson.length; i += chunkSize) {
            send({ type: 'partial', raw: rawJson.slice(0, i + chunkSize) });
            await new Promise((r) => setTimeout(r, 60));
          }
          finalOutput = demoOutput;
        } else {
          const schema = schemaByKind[kind] as unknown as import('zod').ZodType<OutputForKind<typeof kind>>;
          const brandVoiceSuffix = await loadBrandVoiceSuffix();
          const result = streamText({
            model: gateway(model),
            system: systemPromptByKind[kind] + brandVoiceSuffix,
            prompt: finalPrompt,
            output: Output.object({ schema }),
            providerOptions: {
              gateway: {
                user: user.id,
                tags: [`feature:${kind}`, `env:${process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'}`],
              },
            },
          });

          for await (const partial of result.partialOutputStream) {
            send({ type: 'partial', output: partial });
          }
          finalOutput = await result.output;
        }

        const generationId = await logAiGeneration({
          kind,
          prompt: finalPrompt,
          model,
          demo,
          output: finalOutput,
          createdBy: user.id,
        });

        send({ type: 'done', output: finalOutput, demo, model, kind, generationId });
      } catch (err) {
        console.error(`[POST /api/admin/ai/generate-stream] kind=${kind}:`, err);
        // Fall back to demo output on failure so the UI always resolves.
        try {
          const demoOutput = demoOutputForKind(kind, finalPrompt);
          const generationId = await logAiGeneration({
            kind,
            prompt: finalPrompt,
            model,
            demo: true,
            output: demoOutput,
            createdBy: user.id,
          });
          send({ type: 'done', output: demoOutput, demo: true, model, kind, generationId });
        } catch {
          send({ type: 'error', error: err instanceof Error ? err.message : 'Generation failed' });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
