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
  };

  return outputs[kind];
}

export function assertValidKind(kind: string): asserts kind is AiGenerationKind {
  if (!aiGenerationKinds.includes(kind as AiGenerationKind)) {
    throw new Error(`Invalid AI generation kind: ${kind}`);
  }
}
