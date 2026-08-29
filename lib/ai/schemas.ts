import { z } from 'zod';

/**
 * Zod schemas for every supported AI Studio generation "kind".
 * Shared by the API route (structured output validation) and any
 * server-side callers (lib/ai/generate.ts).
 */

export const courseOutlineSchema = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.array(
    z.object({
      title: z.string(),
      lessons: z.array(
        z.object({
          title: z.string(),
          summary: z.string(),
        })
      ),
    })
  ),
});

export const lessonContentSchema = z.object({
  body: z.string().describe('Full lesson content in markdown'),
  keyPoints: z.array(z.string()),
  quizQuestions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number().int(),
    })
  ),
});

export const productDescriptionSchema = z.object({
  headline: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  featureBullets: z.array(z.string()),
});

export const landingPageSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  featureSections: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
    })
  ),
  ctaText: z.string(),
  faqItems: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

export const emailCopySchema = z.object({
  subject: z.string(),
  previewText: z.string(),
  htmlBody: z.string(),
});

export const businessIdeaSchema = z.object({
  audience: z.string(),
  positioning: z.string(),
  productCatalog: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      priceRangeUsd: z.string(),
    })
  ),
});

export const quizSchema = z.object({
  title: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().int().min(0).max(3),
      explanation: z.string().optional(),
    })
  ),
});

export const emailSequenceSchema = z.object({
  name: z.string(),
  emails: z.array(
    z.object({
      subject: z.string(),
      html: z.string(),
      delayDays: z.number().int().min(0),
    })
  ),
});

export const videoScriptSchema = z.object({
  title: z.string(),
  hook: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      talkingPoints: z.array(z.string()),
      durationSec: z.number().int().min(1),
    })
  ),
  cta: z.string(),
});

export const socialPostsSchema = z.object({
  posts: z.array(
    z.object({
      platform: z.enum(['twitter', 'linkedin', 'instagram']),
      content: z.string(),
      hashtags: z.array(z.string()),
    })
  ),
});

export const copyRewriteSchema = z.object({
  improved: z.string(),
  alternatives: z.array(z.string()).length(2),
  rationale: z.string(),
});

/** Member-facing "AI assist" for composing a community post. */
export const postPolishSchema = z.object({
  improved: z.string().describe('Polished version of the draft post, keeping the author voice'),
  hashtags: z.array(z.string()).max(5).describe('Relevant lowercase hashtags, no # prefix'),
});

export const aiGenerationKinds = [
  'course-outline',
  'lesson-content',
  'product-description',
  'landing-page',
  'email-copy',
  'business-idea',
  'quiz',
  'email-sequence',
  'video-script',
  'social-posts',
  'copy-rewrite',
  'post-polish',
] as const;

export type AiGenerationKind = (typeof aiGenerationKinds)[number];

export const schemaByKind = {
  'course-outline': courseOutlineSchema,
  'lesson-content': lessonContentSchema,
  'product-description': productDescriptionSchema,
  'landing-page': landingPageSchema,
  'email-copy': emailCopySchema,
  'business-idea': businessIdeaSchema,
  quiz: quizSchema,
  'email-sequence': emailSequenceSchema,
  'video-script': videoScriptSchema,
  'social-posts': socialPostsSchema,
  'copy-rewrite': copyRewriteSchema,
  'post-polish': postPolishSchema,
} satisfies Record<AiGenerationKind, z.ZodTypeAny>;

export type CourseOutline = z.infer<typeof courseOutlineSchema>;
export type LessonContent = z.infer<typeof lessonContentSchema>;
export type ProductDescription = z.infer<typeof productDescriptionSchema>;
export type LandingPage = z.infer<typeof landingPageSchema>;
export type EmailCopy = z.infer<typeof emailCopySchema>;
export type BusinessIdea = z.infer<typeof businessIdeaSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type EmailSequence = z.infer<typeof emailSequenceSchema>;
export type VideoScript = z.infer<typeof videoScriptSchema>;
export type SocialPosts = z.infer<typeof socialPostsSchema>;
export type CopyRewrite = z.infer<typeof copyRewriteSchema>;
export type PostPolish = z.infer<typeof postPolishSchema>;

export type OutputForKind<K extends AiGenerationKind> = z.infer<(typeof schemaByKind)[K]>;
