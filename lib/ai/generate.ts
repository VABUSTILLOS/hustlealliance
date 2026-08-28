import 'server-only';
import { generateText, Output } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { prisma } from '@/lib/db/prisma';
import { schemaByKind, type AiGenerationKind, type OutputForKind } from './schemas';
import { demoOutputForKind } from './demo';

export const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export const systemPromptByKind: Record<AiGenerationKind, string> = {
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
  quiz:
    'You are an expert instructional designer. Produce a 5-question multiple-choice quiz with exactly 4 options per question, a correct answer index, and a short explanation for each answer.',
  'email-sequence':
    'You are an expert lifecycle email marketer. Produce a 3-email nurture/welcome sequence as simple HTML bodies, with a suggested delay (in days) before each send.',
  'video-script':
    'You are an expert video scriptwriter. Produce a short-form video script with a strong hook, sectioned talking points with estimated durations, and a closing call to action.',
  'social-posts':
    "You are an expert social media copywriter. Produce platform-appropriate posts (Twitter/X, LinkedIn, Instagram) with relevant hashtags, matching each platform's tone and length conventions.",
  'copy-rewrite':
    'You are an expert copy editor. Improve the persuasiveness and clarity of the pasted copy. Provide an improved version, two alternative rewrites, and a short rationale explaining the changes.',
};

/** Reads the `brandVoice` SiteSetting (if present) and formats it as a system prompt suffix. */
export async function loadBrandVoiceSuffix(): Promise<string> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'brandVoice' } });
    if (!setting || !setting.value || typeof setting.value !== 'object') return '';
    const value = setting.value as { tone?: string; audience?: string; guidelines?: string };
    const parts: string[] = [];
    if (value.tone) parts.push(`tone=${value.tone}`);
    if (value.audience) parts.push(`audience=${value.audience}`);
    if (value.guidelines) parts.push(`guidelines=${value.guidelines}`);
    if (parts.length === 0) return '';
    return `\n\nBrand voice: ${parts.join(', ')}`;
  } catch (err) {
    console.error('[ai/generate] Failed to load brand voice setting:', err);
    return '';
  }
}

export interface GenerateAiContentParams<K extends AiGenerationKind> {
  kind: K;
  prompt: string;
  createdBy: string;
  model?: string;
  /** Optional extra direction appended to the prompt (used by "Regenerate"). */
  steer?: string;
}

export interface GenerateAiContentResult<K extends AiGenerationKind> {
  output: OutputForKind<K>;
  demo: boolean;
  model: string;
  generationId: string | null;
}

/** Appends optional "Additional direction" steering text to a prompt. */
export function buildPrompt(prompt: string, steer?: string): string {
  return steer && steer.trim() ? `${prompt}\n\nAdditional direction: ${steer.trim()}` : prompt;
}

/**
 * Logs a completed AI generation to the AiGeneration table. Never lets logging
 * failures break generation. The dev mock user's id may not exist in the DB,
 * so falls back to any real admin user.
 */
export async function logAiGeneration<K extends AiGenerationKind>(params: {
  kind: K;
  prompt: string;
  model: string;
  demo: boolean;
  output: OutputForKind<K>;
  createdBy: string;
}): Promise<string | null> {
  const { kind, prompt, model, demo, output, createdBy } = params;
  try {
    const creator =
      (await prisma.user.findUnique({ where: { id: createdBy }, select: { id: true } })) ??
      (await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } }));
    if (!creator) return null;
    const generation = await prisma.aiGeneration.create({
      data: {
        kind,
        prompt,
        model: demo ? `${model} (demo)` : model,
        output: output as object,
        createdBy: creator.id,
      },
    });
    return generation.id;
  } catch (err) {
    console.error('[ai/generate] Failed to log generation:', err);
    return null;
  }
}

/**
 * Generate structured AI content for a given kind, log it to the AiGeneration
 * table, and return the validated output. Falls back to a deterministic demo
 * response when AI_GATEWAY_API_KEY is not configured (mirrors lib/email/resend.ts).
 */
export async function generateAiContent<K extends AiGenerationKind>(
  params: GenerateAiContentParams<K>
): Promise<GenerateAiContentResult<K>> {
  const { kind, prompt, createdBy, steer } = params;
  const model = params.model || DEFAULT_MODEL;
  const schema = schemaByKind[kind] as unknown as import('zod').ZodType<OutputForKind<K>>;
  const hasGatewayKey = !!process.env.AI_GATEWAY_API_KEY;
  const finalPrompt = buildPrompt(prompt, steer);

  let output: OutputForKind<K>;
  let demo = false;

  if (!hasGatewayKey) {
    demo = true;
    output = demoOutputForKind(kind, finalPrompt);
  } else {
    try {
      const brandVoiceSuffix = await loadBrandVoiceSuffix();
      const result = await generateText({
        model: gateway(model),
        system: systemPromptByKind[kind] + brandVoiceSuffix,
        prompt: finalPrompt,
        output: Output.object({ schema }),
      });
      output = result.output as OutputForKind<K>;
    } catch (err) {
      console.error(`[ai/generate] Gateway call failed for kind=${kind}:`, err);
      demo = true;
      output = demoOutputForKind(kind, finalPrompt);
    }
  }

  const generationId = await logAiGeneration({ kind, prompt: finalPrompt, model, demo, output, createdBy });

  return { output, demo, model, generationId };
}
