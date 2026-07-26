// Journey data: Gamified business to-do list (Level 1-10)
// Each level contains tasks with varying types: text_input, file_upload, checkbox

import { journeyLevelsEs, journeyTasksEs } from './journey-es';
import { buildAdvancedLevels } from './journey-levels-100';

/** Set to true to bypass progression locks for development/testing */
export const DEV_MODE = true;

/** Items per page for the journey pagination */
export const LEVELS_PER_PAGE = 10;

export type TaskType = 'text_input' | 'file_upload' | 'checkbox';

export interface JourneyTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  points: number;
  required: boolean;
  hint?: string;
}

export interface JourneyLevel {
  id: number;
  phase?: number;
  phaseName?: string;
  title: string;
  subtitle: string;
  description: string;
  xpReward: number;
  badgeName: string;
  badgeIcon: string;
  tasks: JourneyTask[];
}

export const journeyLevels: JourneyLevel[] = [
  // ── Level 1: Beginner ──────────────────────────────────────
  {
    id: 1,
    title: 'Define Your Mission',
    subtitle: 'Level 1',
    description: 'Every great business starts with a clear mission. Define yours and set the foundation for everything that follows.\n\n📖 Reference: Simon Sinek\'s "Start With Why" (18-min TED Talk, free).\n\n⚡ Quick Win: Don\'t overthink it. Write one sentence: "We exist to [change X for Y]." Do it in 5 minutes, not 5 days.',
    xpReward: 100,
    badgeName: 'Missionary',
    badgeIcon: '🎯',
    tasks: [
      {
        id: '1-1',
        title: 'Write your mission statement',
        description: 'In 1-2 sentences, describe what your business does, who it serves, and why it exists. Keep it clear and inspiring.',
        type: 'text_input',
        points: 20,
        required: true,
        hint: 'Think: "[Company] helps [target audience] achieve [goal] by [unique approach]."',
      },
      {
        id: '1-2',
        title: 'Identify your target audience',
        description: 'Define the specific group of people who will benefit most from your product or service.',
        type: 'text_input',
        points: 20,
        required: true,
        hint: 'Be specific — demographics, interests, pain points. Avoid "everyone".',
      },
      {
        id: '1-3',
        title: 'Name your business',
        description: 'Choose a name that reflects your mission and is memorable. Write it down and explain why you chose it.',
        type: 'text_input',
        points: 20,
        required: true,
      },
      {
        id: '1-4',
        title: 'Create a simple logo sketch',
        description: 'Draw or design a simple logo concept for your business. Upload a photo or screenshot of your sketch.',
        type: 'file_upload',
        points: 20,
        required: false,
      },
      {
        id: '1-5',
        title: 'Share your mission with one person',
        description: 'Tell at least one person about your business idea and write down their feedback.',
        type: 'text_input',
        points: 20,
        required: false,
        hint: 'Who did you tell? What was their reaction? What questions did they ask?',
      },
    ],
  },

  // ── Level 2 ─────────────────────────────────────────────────
  {
    id: 2,
    title: 'Validate Your Idea',
    subtitle: 'Level 2',
    description: 'Before you invest time and money, validate that real people want what you are building. Most failed startups didn\'t build the wrong thing — they built something nobody wanted.\n\n📖 Reference: "The Mom Test" by Rob Fitzpatrick — how to ask questions that don\'t lie to you.\n\n⚡ Quick Win: Go talk to 3 potential customers TODAY. Don\'t pitch. Just ask about their problems. If they don\'t mention anything close to what you\'re building, pivot now.',
    xpReward: 150,
    badgeName: 'Validator',
    badgeIcon: '🔍',
    tasks: [
      {
        id: '2-1',
        title: 'Identify top 3 customer problems',
        description: 'List the top 3 problems your target customers face that your product solves.',
        type: 'text_input',
        points: 30,
        required: true,
        hint: 'These should be specific pain points, not vague "they need X."',
      },
      {
        id: '2-2',
        title: 'Interview 3 potential customers',
        description: 'Talk to 3 real people in your target market. Upload notes or recordings from your conversations.',
        type: 'file_upload',
        points: 40,
        required: true,
        hint: 'Ask open-ended questions. Listen more than you talk. Document their exact words.',
      },
      {
        id: '2-3',
        title: 'Analyze 3 competitors',
        description: 'Identify 3 competitors (direct or indirect). Write what they do well and where they fall short.',
        type: 'text_input',
        points: 30,
        required: true,
      },
      {
        id: '2-4',
        title: 'Define your unique value proposition',
        description: 'Based on your research, write a clear UVP: Why should customers choose you over alternatives?',
        type: 'text_input',
        points: 25,
        required: true,
        hint: 'Your UVP should be specific enough that a customer can repeat it to a friend.',
      },
      {
        id: '2-5',
        title: 'Create a landing page mockup',
        description: 'Design a simple one-page website mockup that explains your value proposition. Upload a screenshot or sketch.',
        type: 'file_upload',
        points: 25,
        required: false,
      },
    ],
  },

  // ── Level 3 ─────────────────────────────────────────────────
  {
    id: 3,
    title: 'Build Your Brand',
    subtitle: 'Level 3',
    description: 'Create the visual and verbal identity that will make your business stand out and be remembered. But don\'t spend 3 months on this — a great product with a mediocre brand beats a mediocre product with a great brand every time.\n\n📖 Reference: "Building a StoryBrand" by Donald Miller — how to clarify your message so customers listen.\n\n⚡ Quick Win: Pick 2 colors, 1 font, and a name. You can rebrand later. Ship something this week.',
    xpReward: 175,
    badgeName: 'Brand Builder',
    badgeIcon: '🎨',
    tasks: [
      {
        id: '3-1',
        title: 'Choose your brand colors',
        description: 'Select 2-3 primary brand colors. Upload a color palette screenshot or hex codes.',
        type: 'text_input',
        points: 25,
        required: true,
        hint: 'Use tools like Coolors.co to find harmonious color combinations.',
      },
      {
        id: '3-2',
        title: 'Pick your brand fonts',
        description: 'Choose a heading font and a body font. Write why these fonts match your brand personality.',
        type: 'text_input',
        points: 25,
        required: true,
      },
      {
        id: '3-3',
        title: 'Write your brand story',
        description: 'Craft a compelling origin story: Why did you start this business? What drives you? (200-300 words)',
        type: 'text_input',
        points: 50,
        required: true,
      },
      {
        id: '3-4',
        title: 'Design your logo',
        description: 'Create a final version of your logo. Upload the image file (PNG, SVG, or screenshot).',
        type: 'file_upload',
        points: 50,
        required: true,
      },
      {
        id: '3-5',
        title: 'Create social media handles',
        description: 'Reserve your business name on Instagram, Twitter/X, LinkedIn. Check off each one you secured.',
        type: 'checkbox',
        points: 25,
        required: false,
      },
    ],
  },

  // ── Level 4 ─────────────────────────────────────────────────
  {
    id: 4,
    title: 'Legal & Business Basics',
    subtitle: 'Level 4',
    description: 'Get the legal and structural foundation right. This protects you and your business from day one. But sell something first — then formalize. Don\'t spend $2,000 on incorporation before you\'ve made your first $100.\n\n📖 Reference: "Venture Deals" by Brad Feld & Jason Mendelson.\n\n⚡ Quick Win: If you don\'t have customers yet, skip the LLC for now. Use a DBA ("doing business as") through your personal name. Incorporate after your first paying customer.',
    xpReward: 200,
    badgeName: 'Legally Legit',
    badgeIcon: '⚖️',
    tasks: [
      {
        id: '4-1',
        title: 'Choose your business structure',
        description: 'Decide between LLC, Sole Proprietorship, S-Corp, or C-Corp. Write your choice and why.',
        type: 'text_input',
        points: 40,
        required: true,
        hint: 'LLC is often the simplest for first-time founders. Consult a lawyer if unsure.',
      },
      {
        id: '4-2',
        title: 'Register your business name',
        description: 'Check if your business name is available and register it. Upload confirmation or screenshot.',
        type: 'file_upload',
        points: 50,
        required: true,
      },
      {
        id: '4-3',
        title: 'Get an EIN (US) or tax ID',
        description: 'Apply for an Employer Identification Number if in the US, or your country equivalent.',
        type: 'checkbox',
        points: 40,
        required: true,
      },
      {
        id: '4-4',
        title: 'Open a business bank account',
        description: 'Separate personal and business finances. Upload a screenshot of your new account confirmation.',
        type: 'file_upload',
        points: 40,
        required: true,
      },
      {
        id: '4-5',
        title: 'Draft basic terms of service',
        description: 'Write a simple terms of service or terms of use for your website/product.',
        type: 'text_input',
        points: 30,
        required: false,
        hint: 'Use online templates as a starting point, but customize for your business.',
      },
    ],
  },

  // ── Level 5 ─────────────────────────────────────────────────
  {
    id: 5,
    title: 'Build Your MVP',
    subtitle: 'Level 5',
    description: 'Time to build the minimum viable product. Ship fast, learn faster. Done is better than perfect. But sell BEFORE you build — a signed LOI or pre-order beats a prototype every time.\n\n📖 Reference: "The Lean Startup" by Eric Ries — the MVP chapter is essential.\n\n⚡ Quick Win: Can you deliver the value manually today (concierge MVP from Level 2)? If yes, do that first. Build code only when manual doesn\'t scale.',
    xpReward: 250,
    badgeName: 'Builder',
    badgeIcon: '🛠️',
    tasks: [
      {
        id: '5-1',
        title: 'Define MVP features',
        description: 'List the absolute minimum features needed for launch. Cut everything else. Be ruthless.',
        type: 'text_input',
        points: 40,
        required: true,
        hint: 'Your MVP should solve ONE core problem really well. Ship it in weeks, not months.',
      },
      {
        id: '5-2',
        title: 'Create wireframes',
        description: 'Sketch or wireframe the key screens of your product. Upload your wireframes.',
        type: 'file_upload',
        points: 50,
        required: true,
      },
      {
        id: '5-3',
        title: 'Set up your tech stack',
        description: 'Decide on your tech stack (no-code, custom dev, platforms) and write your choices.',
        type: 'text_input',
        points: 30,
        required: true,
        hint: 'Consider: Webflow/Bubble for no-code, Next.js/Django for custom, Shopify for e-commerce.',
      },
      {
        id: '5-4',
        title: 'Build a working prototype',
        description: 'Create a clickable prototype or working demo. Upload a video walkthrough or link.',
        type: 'file_upload',
        points: 80,
        required: true,
      },
      {
        id: '5-5',
        title: 'Test with 5 users',
        description: 'Get 5 people to use your prototype. Write down their feedback and what you will fix.',
        type: 'text_input',
        points: 50,
        required: true,
      },
    ],
  },

  // ── Level 6 ─────────────────────────────────────────────────
  {
    id: 6,
    title: 'Marketing & Growth',
    subtitle: 'Level 6',
    description: 'Build the engine that brings customers to your product. Marketing starts before launch. The best marketing is so good it feels like a service, not an ad.\n\n📖 Reference: Alex Hormozi\'s "$100M Leads" (free) and Seth Godin\'s "This Is Marketing."\n\n⚡ Quick Win: Don\'t wait for "perfect." Post one piece of content today about the problem you solve. Track if anyone engages. That\'s your first marketing data point.',
    xpReward: 250,
    badgeName: 'Growth Hacker',
    badgeIcon: '📈',
    tasks: [
      {
        id: '6-1',
        title: 'Create a go-to-market plan',
        description: 'Write a 1-page plan outlining how you will acquire your first 100 customers.',
        type: 'text_input',
        points: 50,
        required: true,
        hint: 'Be specific about channels (social, SEO, ads, partnerships) and timeline.',
      },
      {
        id: '6-2',
        title: 'Set up social media profiles',
        description: 'Create and optimize profiles on 3 social platforms relevant to your audience. Upload screenshots.',
        type: 'file_upload',
        points: 40,
        required: true,
      },
      {
        id: '6-3',
        title: 'Write your first blog post or content piece',
        description: 'Create one piece of valuable content for your target audience. Paste the text or upload.',
        type: 'text_input',
        points: 50,
        required: true,
      },
      {
        id: '6-4',
        title: 'Build an email waitlist',
        description: 'Set up a simple email capture page. Upload a screenshot of your signup form.',
        type: 'file_upload',
        points: 60,
        required: false,
      },
      {
        id: '6-5',
        title: 'Create a 30-day content calendar',
        description: 'Plan 30 days of social media posts, emails, or content. Upload your calendar.',
        type: 'file_upload',
        points: 50,
        required: false,
      },
    ],
  },

  // ── Level 7 ─────────────────────────────────────────────────
  {
    id: 7,
    title: 'Sales & Fundraising',
    subtitle: 'Level 7',
    description: 'Learn to sell your vision — to customers and investors. Sales is the lifeblood of any business. You don\'t need a perfect product to sell; you need a compelling problem, a credible solution, and the courage to ask for money.\n\n📖 Reference: "Never Split the Difference" by Chris Voss (FBI negotiator tactics for sales) and "Predictable Revenue" by Aaron Ross.\n\n⚡ Quick Win: Make ONE sales call or send ONE pitch DM today. Not tomorrow. The first one is the hardest — get it over with. Record what you learned.',
    xpReward: 300,
    badgeName: 'Closer',
    badgeIcon: '🤝',
    tasks: [
      {
        id: '7-1',
        title: 'Create a pitch deck outline',
        description: 'Outline a 10-12 slide pitch deck. Write the key message for each slide.',
        type: 'text_input',
        points: 50,
        required: true,
        hint: 'Slides: Problem, Solution, Market, Business Model, Traction, Team, Competition, Financials, Ask.',
      },
      {
        id: '7-2',
        title: 'Build your financial model',
        description: 'Create a basic revenue and cost projection for 12 months. Upload your spreadsheet.',
        type: 'file_upload',
        points: 60,
        required: true,
      },
      {
        id: '7-3',
        title: 'Practice your elevator pitch',
        description: 'Record a 60-second pitch video or write your exact pitch script.',
        type: 'text_input',
        points: 40,
        required: true,
      },
      {
        id: '7-4',
        title: 'Make your first sale',
        description: 'Sell your product to one paying customer. Write about the experience — what worked, what did not.',
        type: 'text_input',
        points: 100,
        required: false,
        hint: 'Even $1 counts. The goal is validation, not revenue (yet).',
      },
      {
        id: '7-5',
        title: 'List 10 potential investors or grants',
        description: 'Research and list 10 investors, accelerators, or grants relevant to your stage.',
        type: 'text_input',
        points: 50,
        required: false,
      },
    ],
  },

  // ── Level 8 ─────────────────────────────────────────────────
  {
    id: 8,
    title: 'Scale Your Operations',
    subtitle: 'Level 8',
    description: 'Build systems, hire help, and create processes that let your business run without you. Your goal is to become the owner, not the operator. If the business breaks when you take a day off, you have a job, not a business.\n\n📖 Reference: "The E-Myth Revisited" by Michael Gerber — work ON your business, not IN it.\n\n⚡ Quick Win: Pick your most time-consuming repeatable task. Spend 20 minutes writing it down step-by-step. That\'s your first SOP.',
    xpReward: 350,
    badgeName: 'Operator',
    badgeIcon: '⚙️',
    tasks: [
      {
        id: '8-1',
        title: 'Document your core processes',
        description: 'Write down the step-by-step process for your 3 most important repeatable tasks.',
        type: 'text_input',
        points: 60,
        required: true,
        hint: 'If you can not document it, you can not delegate it. Be detailed.',
      },
      {
        id: '8-2',
        title: 'Set up customer support system',
        description: 'Choose a support tool (email, chat, help desk) and set it up. Upload a screenshot.',
        type: 'file_upload',
        points: 50,
        required: true,
      },
      {
        id: '8-3',
        title: 'Create onboarding for new customers',
        description: 'Design a customer onboarding flow. Write the welcome email and first-touch experience.',
        type: 'text_input',
        points: 60,
        required: true,
      },
      {
        id: '8-4',
        title: 'Hire your first freelancer or VA',
        description: 'Delegate one recurring task to a freelancer or virtual assistant. Write what you delegated and the result.',
        type: 'text_input',
        points: 80,
        required: false,
        hint: 'Start small — 5 hours/week is enough to learn how to manage help.',
      },
      {
        id: '8-5',
        title: 'Set up basic analytics',
        description: 'Install analytics (Google Analytics, Mixpanel, or similar) and upload a dashboard screenshot.',
        type: 'file_upload',
        points: 50,
        required: false,
      },
    ],
  },

  // ── Level 9 ─────────────────────────────────────────────────
  {
    id: 9,
    title: 'Product-Market Fit',
    subtitle: 'Level 9',
    description: 'Find the sweet spot where your product meets a massive market need. True PMF is when customers would be genuinely upset if your product disappeared tomorrow. If you\'re not there yet, keep talking to customers and iterating.\n\n📖 Reference: Marc Andreessen\'s essay "The Only Thing That Matters" (free, 2007 — still the best PMF definition).\n\n⚡ Quick Win: Ask 10 customers: "How disappointed would you be if we shut down?" If fewer than 4 say "very disappointed," you haven\'t found PMF yet. Fix that before scaling.',
    xpReward: 400,
    badgeName: 'PMF Achiever',
    badgeIcon: '🚀',
    tasks: [
      {
        id: '9-1',
        title: 'Measure your retention rate',
        description: 'Calculate your monthly customer retention rate. Write the number and how you calculated it.',
        type: 'text_input',
        points: 60,
        required: true,
        hint: 'For SaaS: what % of customers from last month are still active? Target: >80% for PMF signal.',
      },
      {
        id: '9-2',
        title: 'Run a NPS survey',
        description: 'Survey your customers with "How likely are you to recommend us?" Upload results.',
        type: 'text_input',
        points: 50,
        required: true,
      },
      {
        id: '9-3',
        title: 'Identify your power users',
        description: 'Find the 20% of users getting 80% of the value. Write what makes them different.',
        type: 'text_input',
        points: 60,
        required: true,
      },
      {
        id: '9-4',
        title: 'Run a pricing experiment',
        description: 'Test a different price point or pricing model. Document what you tested and the results.',
        type: 'text_input',
        points: 80,
        required: false,
      },
      {
        id: '9-5',
        title: 'Create a feature request system',
        description: 'Set up a way for users to request and vote on features. Upload a screenshot.',
        type: 'file_upload',
        points: 50,
        required: false,
      },
    ],
  },

  // ── Level 10 ────────────────────────────────────────────────
  {
    id: 10,
    title: 'Launch & Scale',
    subtitle: 'Level 10',
    description: 'You have validated, built, and iterated. Now it is time to launch publicly and scale your growth. But launching isn\'t the finish line — it\'s the starting line. The real game begins now. Build your community, give back, and become the mentor you wish you had.\n\n📖 Reference: "The Hard Thing About Hard Things" by Ben Horowitz and Simon Sinek\'s "The Infinite Game."\n\n⚡ Quick Win: Launch does not need to be viral. Tell 50 people personally. If each tells 2, you\'ve got 150 users. That\'s a launch.',
    xpReward: 500,
    badgeName: 'Launched',
    badgeIcon: '🎉',
    tasks: [
      {
        id: '10-1',
        title: 'Plan your launch event',
        description: 'Write your launch strategy: date, channels, target audience, PR plan, and success metrics.',
        type: 'text_input',
        points: 80,
        required: true,
      },
      {
        id: '10-2',
        title: 'Build a press kit',
        description: 'Create a press kit with logos, screenshots, founder bios, and key facts. Upload as a PDF or link.',
        type: 'file_upload',
        points: 80,
        required: true,
      },
      {
        id: '10-3',
        title: 'Reach out to 10 journalists or bloggers',
        description: 'Find and contact 10 relevant journalists or bloggers. Write a sample pitch email.',
        type: 'text_input',
        points: 60,
        required: true,
      },
      {
        id: '10-4',
        title: 'Launch on Product Hunt or equivalent',
        description: 'Submit your product to Product Hunt, Hacker News, or a relevant launch platform.',
        type: 'checkbox',
        points: 100,
        required: true,
      },
      {
        id: '10-5',
        title: 'Write a post-launch retrospective',
        description: 'After launch, write a reflection: What went well? What surprised you? What will you do differently?',
        type: 'text_input',
        points: 80,
        required: true,
        hint: 'This becomes a valuable artifact for your next venture — and great content for your audience.',
      },
    ],
  },
];

// --- Combined array (existing 10 + 100 advanced) ---

/** All levels in order: existing 10 (IDs 1-10) + 100 advanced (IDs 11-110) */
export const allJourneyLevels: JourneyLevel[] = [
  ...journeyLevels,
  ...buildAdvancedLevels(),
];

/** Total number of levels */
export const TOTAL_LEVELS = allJourneyLevels.length;

/** Calculate total pages based on LEVELS_PER_PAGE */
export function getTotalPages(): number {
  return Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);
}

/** Get levels for a specific page (1-indexed) */
export function getLevelsForPage(page: number): JourneyLevel[] {
  const start = (page - 1) * LEVELS_PER_PAGE;
  return allJourneyLevels.slice(start, start + LEVELS_PER_PAGE);
}

// --- Helper functions ---

export function getLevelById(id: number): JourneyLevel | undefined {
  return allJourneyLevels.find((l) => l.id === id);
}

export function getTaskById(levelId: number, taskId: string): JourneyTask | undefined {
  const level = getLevelById(levelId);
  return level?.tasks.find((t) => t.id === taskId);
}

export function getTotalXPForLevel(level: JourneyLevel): number {
  return level.tasks.reduce((sum, t) => sum + t.points, 0) + level.xpReward;
}

// Localization helper
export function getLocalizedJourneyLevels(locale: 'en' | 'es'): JourneyLevel[] {
  const baseLevels = allJourneyLevels;
  if (locale === 'en') return baseLevels;
  return baseLevels.map((level) => ({
    ...level,
    title: journeyLevelsEs[level.id]?.title ?? level.title,
    subtitle: journeyLevelsEs[level.id]?.subtitle ?? level.subtitle,
    description: journeyLevelsEs[level.id]?.description ?? level.description,
    badgeName: journeyLevelsEs[level.id]?.badgeName ?? level.badgeName,
    tasks: level.tasks.map((task) => ({
      ...task,
      title: journeyTasksEs[task.id]?.title ?? task.title,
      description: journeyTasksEs[task.id]?.description ?? task.description,
      hint: journeyTasksEs[task.id]?.hint ?? task.hint,
    })),
  }));
}
