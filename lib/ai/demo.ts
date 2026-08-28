import 'server-only';
import {
  aiGenerationKinds,
  type AiGenerationKind,
  type OutputForKind,
} from './schemas';

/**
 * Deterministic mock output used when AI_GATEWAY_API_KEY is not configured.
 * Mirrors the shape of the real structured output for each kind, so callers
 * (UI + integrations) work identically in demo mode.
 */
export function demoOutputForKind<K extends AiGenerationKind>(
  kind: K,
  prompt: string
): OutputForKind<K> {
  const idea = prompt.trim() || 'Your Idea';

  const outputs: { [P in AiGenerationKind]: OutputForKind<P> } = {
    'course-outline': {
      title: `${idea}: The Complete Course`,
      description: `A demo-mode course outline generated from the prompt "${idea}". Connect AI_GATEWAY_API_KEY for real AI-generated outlines.`,
      modules: [
        {
          title: 'Module 1: Getting Started',
          lessons: [
            { title: 'Introduction & Goals', summary: `Overview of what you'll learn about ${idea}.` },
            { title: 'Core Concepts', summary: 'Key terminology and foundational ideas.' },
          ],
        },
        {
          title: 'Module 2: Applying the Skills',
          lessons: [
            { title: 'Hands-on Practice', summary: 'Guided exercises to build real experience.' },
            { title: 'Common Pitfalls', summary: 'Mistakes to avoid and how to fix them.' },
          ],
        },
      ],
    },
    'lesson-content': {
      body: `# ${idea}\n\nThis is placeholder lesson content generated in demo mode. Enable the AI Gateway to generate real content.\n\n## Overview\n\nThis lesson covers the essentials of ${idea}.`,
      keyPoints: ['Understand the fundamentals', 'Apply the concept in practice', 'Avoid common mistakes'],
      quizQuestions: [
        {
          question: `What is the main topic of this lesson?`,
          options: [idea, 'Unrelated topic', 'None of the above', 'All of the above'],
          correctIndex: 0,
        },
      ],
    },
    'product-description': {
      headline: `${idea} — Built for Results`,
      shortDescription: `A demo-mode short description for ${idea}.`,
      longDescription: `This is a placeholder long-form product description for "${idea}", generated without an AI Gateway key. It illustrates the expected structure: a compelling narrative about the product's value.`,
      featureBullets: ['Easy to use', 'Proven results', 'Built by experts', 'Ongoing support'],
    },
    'landing-page': {
      headline: `${idea}`,
      subheadline: `Everything you need to succeed with ${idea}.`,
      featureSections: [
        { title: 'Why it works', body: `${idea} is designed around real outcomes, not just theory.` },
        { title: 'Who it is for', body: 'Beginners and experienced hustlers alike.' },
      ],
      ctaText: 'Get Started Now',
      faqItems: [
        { question: `Is ${idea} beginner-friendly?`, answer: 'Yes, no prior experience required.' },
        { question: 'How long does it take?', answer: 'Self-paced — go as fast or slow as you like.' },
      ],
    },
    'email-copy': {
      subject: `Welcome to ${idea}! 🚀`,
      previewText: `Here's how to get the most out of ${idea}.`,
      htmlBody: `<div><h1>Welcome!</h1><p>This is demo-mode email copy for "${idea}". Connect AI_GATEWAY_API_KEY to generate real copy.</p></div>`,
    },
    'business-idea': {
      audience: `Aspiring entrepreneurs interested in ${idea}.`,
      positioning: `Position "${idea}" as the accessible, no-fluff way to get started fast.`,
      productCatalog: [
        { name: `${idea} Starter Kit`, description: 'An entry-level offer to build trust.', priceRangeUsd: '$19-$49' },
        { name: `${idea} Pro Bundle`, description: 'A premium offer with deeper support.', priceRangeUsd: '$99-$299' },
      ],
    },
    quiz: {
      title: `${idea} Quiz`,
      questions: Array.from({ length: 5 }, (_, i) => ({
        question: `Demo question ${i + 1} about ${idea}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0,
        explanation: `Option A is correct because it best reflects the core idea of ${idea}.`,
      })),
    },
    'email-sequence': {
      name: `${idea} Welcome Sequence`,
      emails: [
        {
          subject: `Welcome to ${idea}! 🚀`,
          html: `<div><h1>Welcome!</h1><p>Demo-mode email 1 of 3 for "${idea}".</p></div>`,
          delayDays: 0,
        },
        {
          subject: `Getting the most out of ${idea}`,
          html: `<div><h1>Tips</h1><p>Demo-mode email 2 of 3 for "${idea}".</p></div>`,
          delayDays: 2,
        },
        {
          subject: `Don't miss out on ${idea}`,
          html: `<div><h1>Last call</h1><p>Demo-mode email 3 of 3 for "${idea}".</p></div>`,
          delayDays: 5,
        },
      ],
    },
    'video-script': {
      title: `${idea}: The Video`,
      hook: `Ever wondered how to master ${idea} in record time?`,
      sections: [
        { heading: 'Intro', talkingPoints: [`Why ${idea} matters`, 'What you will learn'], durationSec: 30 },
        { heading: 'Main Content', talkingPoints: ['Core concept #1', 'Core concept #2', 'A quick example'], durationSec: 120 },
        { heading: 'Wrap-up', talkingPoints: ['Recap key points', 'Encourage action'], durationSec: 30 },
      ],
      cta: `Ready to get started with ${idea}? Link in the description.`,
    },
    'social-posts': {
      posts: [
        {
          platform: 'twitter',
          content: `Demo-mode post about ${idea}. Connect AI_GATEWAY_API_KEY for real copy.`,
          hashtags: ['#hustle', '#sidehustle'],
        },
        {
          platform: 'linkedin',
          content: `Thinking about ${idea}? Here's a demo-mode take on why it matters for your career.`,
          hashtags: ['#careergrowth', '#entrepreneurship'],
        },
        {
          platform: 'instagram',
          content: `${idea} ✨ (demo-mode caption — connect AI_GATEWAY_API_KEY for real copy)`,
          hashtags: ['#hustlealliance', '#motivation'],
        },
      ],
    },
    'copy-rewrite': {
      improved: `${idea}\n\n(Demo-mode improved version — connect AI_GATEWAY_API_KEY for a real rewrite.)`,
      alternatives: [
        `Alternative take #1 on: ${idea}`,
        `Alternative take #2 on: ${idea}`,
      ],
      rationale: 'Demo-mode rationale: tightened language, added a clearer benefit statement, and stronger call to action.',
    },
  };

  return outputs[kind];
}

export function assertValidKind(kind: string): asserts kind is AiGenerationKind {
  if (!aiGenerationKinds.includes(kind as AiGenerationKind)) {
    throw new Error(`Invalid AI generation kind: ${kind}`);
  }
}
