import 'server-only';
import { generateText, Output } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { prisma } from '@/lib/db/prisma';
import { schemaByKind, type AiGenerationKind, type OutputForKind } from './schemas';
import { demoOutputForKind } from './demo';

const DEFAULT_MODEL = 'openai/gpt-4o-mini';

const systemPromptByKind: Record<AiGenerationKind, string> = {
  'course-outline':
    'You are an expert curriculum designer. Produce a well-structured course outline with clear, actionable modules and lessons.',
  'lesson-content':
    'You are an expert instructional writer. Produce clear, engaging lesson content in markdown with key takeaways and a short quiz.',
  'product-description':
    'You are an expert copywriter. Produce a compelling, benefit-driven product description.',
  'landing-page':
    'You are an expert conversion copywriter. Produce persuasive landing page copy with clear sections and an FAQ.',
  'email-copy':
    'You are an expert email marketer. Produce concise, high-converting email copy as simple HTML.',
  'business-idea':
    'You are a startup strategist (Overmind-style). From a one-line idea, produce a concrete product catalog, target audience, and positioning statement.',
};

export interface GenerateAiContentParams<K extends AiGenerationKind> {
  kind: K;
  prompt: string;
  createdBy: string;
  model?: string;
}

export interface GenerateAiContentResult<K extends AiGenerationKind> {
  output: OutputForKind<K>;
  demo: boolean;
  model: string;
  generationId: string | null;
}

/**
 * Generate structured AI content for a given kind, log it to the AiGeneration
 * table, and return the validated output. Falls back to a deterministic demo
 * response when AI_GATEWAY_API_KEY is not configured (mirrors lib/email/resend.ts).
 */
export async function generateAiContent<K extends AiGenerationKind>(
  params: GenerateAiContentParams<K>
): Promise<GenerateAiContentResult<K>> {
  const { kind, prompt, createdBy } = params;
  const model = params.model || DEFAULT_MODEL;
  const schema = schemaByKind[kind] as unknown as import('zod').ZodType<OutputForKind<K>>;
  const hasGatewayKey = !!process.env.AI_GATEWAY_API_KEY;

  let output: OutputForKind<K>;
  let demo = false;

  if (!hasGatewayKey) {
    demo = true;
    output = demoOutputForKind(kind, prompt);
  } else {
    try {
      const result = await generateText({
        model: gateway(model),
        system: systemPromptByKind[kind],
        prompt,
        output: Output.object({ schema }),
      });
      output = result.output as OutputForKind<K>;
    } catch (err) {
      console.error(`[ai/generate] Gateway call failed for kind=${kind}:`, err);
      demo = true;
      output = demoOutputForKind(kind, prompt);
    }
  }

  // Audit log — never let logging failures break generation. The dev mock
  // user's id may not exist in the DB, so fall back to any real admin user.
  let generationId: string | null = null;
  try {
    const creator =
      (await prisma.user.findUnique({ where: { id: createdBy }, select: { id: true } })) ??
      (await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } }));
    if (creator) {
      const generation = await prisma.aiGeneration.create({
        data: {
          kind,
          prompt,
          model: demo ? `${model} (demo)` : model,
          output: output as object,
          createdBy: creator.id,
        },
      });
      generationId = generation.id;
    }
  } catch (err) {
    console.error('[ai/generate] Failed to log generation:', err);
  }

  return { output, demo, model, generationId };
}
