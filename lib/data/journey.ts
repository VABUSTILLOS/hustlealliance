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
      {
        id: '1-6',
        title: 'Define your WHY — the deeper reason',
        description: 'Beyond money or freedom, why does this business need to exist? What personal experience drives you? (100-200 words)',
        type: 'text_input',
        points: 15,
        required: false,
        hint: 'The strongest WHY comes from a problem you lived through. If you haven\'t lived it, talk to 3 people who have.',
      },
      {
        id: '1-7',
        title: 'Write 3 non-negotiable core values',
        description: 'List 3 principles that will guide every decision in your business. These are your constitution.',
        type: 'text_input',
        points: 15,
        required: false,
        hint: 'Examples: "Customer-first, always", "Ship fast, iterate faster", "Transparency over polish". Make them yours.',
      },
      {
        id: '1-8',
        title: 'Craft your one-sentence pitch',
        description: 'Condense your mission into one sentence a stranger would understand and remember.',
        type: 'text_input',
        points: 20,
        required: false,
        hint: 'Formula: "We help [X audience] who struggle with [Y problem] by [Z unique solution] — so they can [aspirational outcome]."',
      },
      {
        id: '1-9',
        title: 'Visualize your 12-month vision',
        description: 'Paint the picture: 12 months from now, what does success look like? Revenue, team size, customers, impact. Write it in present tense.',
        type: 'text_input',
        points: 20,
        required: false,
        hint: 'Start with "It is [Month 202X]. We just..." — make it vivid enough that it gives you chills.',
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
      {
        id: '2-6',
        title: 'Pre-sell your solution before building',
        description: 'Write a short email or DM pitch and send it to 3 potential customers asking if they would pay for your solution. Record their responses word-for-word.',
        type: 'text_input',
        points: 25,
        required: false,
        hint: 'Don\'t ask "Would you use this?" — ask "Would you pay $X for this?" The wallet is the only honest answer. Even one "yes" is gold.',
      },
      {
        id: '2-7',
        title: 'Build a problem-solution matrix',
        description: 'Create a simple table: column 1 = customer problem, column 2 = how severe (1-10), column 3 = your proposed solution, column 4 = existing alternatives. Upload as a file.',
        type: 'file_upload',
        points: 25,
        required: false,
        hint: 'If multiple problems score 8+, you have a platform idea. If only one scores high, start there — become the best at solving that ONE thing.',
      },
      {
        id: '2-8',
        title: 'Run a "smoke test" in 24 hours',
        description: 'Create a fake ad or social post describing your product (without building it). Measure clicks, signups, or DMs. Write down the results.',
        type: 'text_input',
        points: 30,
        required: false,
        hint: 'Use a free tool like Carrd, Gumroad pre-order, or a simple Google Form. If nobody clicks, tweak the messaging and try again. If they click but don\'t convert, the price or value prop is off.',
      },
      {
        id: '2-9',
        title: 'Calculate your minimum viable price',
        description: 'Based on your customer interviews and competitor analysis, determine the lowest price that makes your business viable. Show your math.',
        type: 'text_input',
        points: 20,
        required: false,
        hint: 'Rule of thumb: Your price should be at least 3x your cost. Higher prices attract better customers. DO NOT compete on price — compete on value.',
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
      {
        id: '3-6',
        title: 'Write your 7-word tagline',
        description: 'The best taglines fit in a tweet — literally 7 words or fewer. Write yours. Test it on 3 strangers.',
        type: 'text_input',
        points: 25,
        required: false,
        hint: 'Nike: "Just do it." Apple: "Think different." Your tagline should make someone nod or smile in under 2 seconds.',
      },
      {
        id: '3-7',
        title: 'Define your brand voice in 3 adjectives',
        description: 'If your brand were a person, how would they talk? Pick 3 adjectives (e.g., "bold, witty, no-BS") and write 2 sample social posts in that voice.',
        type: 'text_input',
        points: 25,
        required: false,
        hint: 'Your brand voice = how you speak when nobody is watching. It should feel natural, not corporate. Write like you talk.',
      },
      {
        id: '3-8',
        title: 'Create a brand asset folder',
        description: 'Compile your logo, colors, fonts, and tagline into one organized folder. Upload a screenshot of your folder structure.',
        type: 'file_upload',
        points: 25,
        required: false,
        hint: 'Organization IS branding. When you need assets fast (for a pitch, post, or partner), you should find everything in under 30 seconds.',
      },
      {
        id: '3-9',
        title: 'Do a "brand review" with 3 strangers',
        description: 'Show your logo, name, and tagline to 3 people who don\'t know you. Ask: "What type of business do you think this is?" Write their answers.',
        type: 'text_input',
        points: 30,
        required: false,
        hint: 'If their answer matches your intention, your brand is working. If not, iterate — better to find out now than after spending $5K on design.',
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
      {
        id: '4-6',
        title: 'Draft a simple co-founder agreement',
        description: 'If you have a co-founder, write down equity split, roles, decision-making, and what happens if someone leaves. Upload the document.',
        type: 'file_upload',
        points: 30,
        required: false,
        hint: 'Don\'t skip this. More startups die from co-founder fights than from competition. Use a template from Foundrs.com or Y Combinator\'s standard agreement.',
      },
      {
        id: '4-7',
        title: 'Set up a simple accounting spreadsheet',
        description: 'Create a basic income/expense tracker for your first 12 months. Include categories for revenue, costs, taxes, and profit. Upload your template.',
        type: 'file_upload',
        points: 25,
        required: false,
        hint: 'Use Google Sheets (free). Columns: Date, Description, Category, Amount In, Amount Out, Running Balance. Takes 15 minutes, saves thousands in tax headaches.',
      },
      {
        id: '4-8',
        title: 'Get a business insurance quote',
        description: 'Contact 2 insurance providers and get quotes for general liability insurance. Write down the quotes and what they cover.',
        type: 'text_input',
        points: 25,
        required: false,
        hint: 'Many founders skip insurance until something goes wrong — and then it\'s too late. A basic policy often costs less than your monthly coffee budget.',
      },
      {
        id: '4-9',
        title: 'Open a Stripe or payment processor account',
        description: 'Set up a payment processor so you can accept money. Upload a screenshot of your active account dashboard.',
        type: 'file_upload',
        points: 25,
        required: false,
        hint: 'Do this BEFORE you need it. Stripe takes 5 minutes. The fastest way to lose a sale is "I\'ll send you an invoice." Accept payment NOW.',
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
      {
        id: '5-6',
        title: 'Sell it BEFORE you build it',
        description: 'Write a pre-order or early-access pitch and try to get at least one commitment (even for $1) before writing code. Document the attempt and result.',
        type: 'text_input',
        points: 35,
        required: false,
        hint: 'The ultimate validation: someone pays you before the product exists. If you can\'t get one pre-order, your MVP features list might be wrong.',
      },
      {
        id: '5-7',
        title: 'Time-box your build to 7 days',
        description: 'Set a hard 7-day deadline. Write down what you can realistically ship in that window. Strip everything else.',
        type: 'text_input',
        points: 25,
        required: false,
        hint: 'Parkinson\'s Law: work expands to fill the time available. Give yourself 7 days max for the first version. If nothing ships in 7 days, the scope is too big.',
      },
      {
        id: '5-8',
        title: 'Create a user feedback capture system',
        description: 'Set up a simple way for your 5 test users to report bugs and suggest features (Google Form, Discord, or in-app feedback). Upload a screenshot.',
        type: 'file_upload',
        points: 20,
        required: false,
        hint: 'Without a feedback channel, every bug and feature request lives in your email or DMs. Centralize it from day one — it takes 10 minutes.',
      },
      {
        id: '5-9',
        title: 'Do a "CEO walkthrough" — record yourself using it',
        description: 'Record a 3-5 minute video of you using your own product as a first-time user. Upload the video or a link.',
        type: 'file_upload',
        points: 30,
        required: false,
        hint: 'You will cringe. That\'s the point. The friction YOU feel is the friction your customers feel. Fix the top 3 pain points you notice.',
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
      {
        id: '6-6',
        title: 'Execute one $0 guerrilla marketing stunt',
        description: 'Do one creative, zero-budget marketing action TODAY. Examples: leave sticky notes at a co-working space, comment on 20 relevant Reddit threads, DM 10 potential customers. Document what you did and any results.',
        type: 'text_input',
        points: 35,
        required: false,
        hint: 'The best guerrilla marketing doesn\'t feel like marketing. Be helpful, not spammy. Track EVERYTHING — one of these stunts might become your main growth channel.',
      },
      {
        id: '6-7',
        title: 'Find and pitch 3 cross-promotion partners',
        description: 'Identify 3 businesses or creators who serve the same audience but aren\'t competitors. Write your pitch for a mutual shoutout or collaboration.',
        type: 'text_input',
        points: 30,
        required: false,
        hint: 'Example: a personal trainer and a meal-prep service. Same audience, complementary products, zero competition. Offer to promote them first — generosity compounds.',
      },
      {
        id: '6-8',
        title: 'Analyze a competitor\'s marketing funnel',
        description: 'Pick your top competitor. Map their entire marketing funnel: how they get attention → capture leads → nurture → convert. Write what you\'d steal and what you\'d improve.',
        type: 'text_input',
        points: 25,
        required: false,
        hint: 'Subscribe to their email list. Follow their socials. Take notes for a week. Their marketing budget is your free R&D lab.',
      },
      {
        id: '6-9',
        title: 'Post content every day for 7 days',
        description: 'Commit to posting one piece of content daily for 7 days straight. Track engagement on each. Upload screenshots or links.',
        type: 'file_upload',
        points: 35,
        required: false,
        hint: 'Consistency > perfection. A mediocre post every day beats a masterpiece once a month. By day 7, you\'ll have a week of data showing what resonates.',
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
      {
        id: '7-6',
        title: 'Send 10 cold outreach messages TODAY',
        description: 'Write and send 10 DM or email pitches to potential customers. Copy your exact message and note any responses.',
        type: 'text_input',
        points: 35,
        required: false,
        hint: 'Don\'t overthink. Personalize each one (mention something specific about them). Track open rates. Expect 1-2 responses per 10 — that\'s normal. Volume beats perfection.',
      },
      {
        id: '7-7',
        title: 'Prepare for the 5 most common objections',
        description: 'List the 5 objections you expect to hear (e.g., "too expensive," "not right now," "let me think about it") and write your counter for each.',
        type: 'text_input',
        points: 30,
        required: false,
        hint: 'Objections aren\'t rejection — they\'re requests for more information. "It\'s too expensive" often means "I don\'t understand the value yet." Bridge that gap.',
      },
      {
        id: '7-8',
        title: 'Design 3 pricing tiers',
        description: 'Create 3 pricing levels: a low-risk entry point, your target offer, and a premium option. Write the features and price for each.',
        type: 'text_input',
        points: 30,
        required: false,
        hint: 'The middle tier should be your "obvious choice." The cheap tier makes it look affordable. The premium tier makes the middle look reasonable. This is called price anchoring.',
      },
      {
        id: '7-9',
        title: 'Build a simple referral system',
        description: 'Design a "tell a friend" incentive. Write the email template and decide on the reward (discount, free month, etc.).',
        type: 'text_input',
        points: 25,
        required: false,
        hint: 'Your happiest customers are your best salespeople — and they\'re free. A simple "give $10, get $10" referral program can 2-3x your growth with zero ad spend.',
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
      {
        id: '8-6',
        title: 'Automate one repetitive task',
        description: 'Identify the one task you do most often (data entry, scheduling, reporting) and set up an automation to handle it. Write what you automated and how.',
        type: 'text_input',
        points: 30,
        required: false,
        hint: 'Tools: Zapier (no-code), n8n (self-hosted), or simple email filters. If a task takes you 10+ min daily, automating it saves 60+ hours per year.',
      },
      {
        id: '8-7',
        title: 'Set up a daily 10-minute standup routine',
        description: 'If you have a team (even 1-2 people), implement a daily 10-min check-in: What did you do yesterday? What will you do today? Any blockers? Document your format.',
        type: 'text_input',
        points: 20,
        required: false,
        hint: 'If you\'re solo, do a "solo standup" — write your 3 answers in a notebook each morning. It creates accountability to YOURSELF, which is harder than accountability to a boss.',
      },
      {
        id: '8-8',
        title: 'Set up a project management tool',
        description: 'Choose a PM tool (Notion, Trello, Linear, Asana) and set up your first board with all active tasks. Upload a screenshot.',
        type: 'file_upload',
        points: 25,
        required: false,
        hint: 'If your tasks live in your brain, your brain is the bottleneck. Externalize everything. A $0 Notion board is infinitely better than "I\'ll remember it."',
      },
      {
        id: '8-9',
        title: 'Analyze your last 10 customer churns',
        description: 'Look at the last 10 customers who left or stopped using your product. Identify the top 3 reasons. Write an action plan to fix the biggest one.',
        type: 'text_input',
        points: 35,
        required: false,
        hint: 'Churn kills growth faster than slow acquisition. Reducing churn by 5% can increase revenue by 25%+. Fix the leaks before pouring more water in the bucket.',
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
      {
        id: '9-6',
        title: 'Conduct 5 "exit interviews" with churned users',
        description: 'Reach out to 5 users who stopped using your product. Ask why they left — politely, no sales pitch. Write their verbatim answers.',
        type: 'text_input',
        points: 35,
        required: false,
        hint: 'Churned users tell the truth. Active users tell you what you want to hear. A 10-minute call with a churned user is worth more than a 100-person survey.',
      },
      {
        id: '9-7',
        title: 'Map your full user journey from signup to "aha moment"',
        description: 'Diagram every step a user takes from first visit to the moment they get real value. Upload your diagram.',
        type: 'file_upload',
        points: 30,
        required: false,
        hint: 'The "aha moment" is when a user thinks "I get it — this is amazing." Measure how many steps it takes to get there. Then cut that number in half.',
      },
      {
        id: '9-8',
        title: 'Run a cohort retention analysis',
        description: 'Group users by signup month and calculate what percentage are still active after 30, 60, and 90 days. Write the numbers.',
        type: 'text_input',
        points: 35,
        required: false,
        hint: 'If newer cohorts retain BETTER than older cohorts, your product is improving. If they retain WORSE, you\'re shipping features nobody wants. This one metric tells the truth.',
      },
      {
        id: '9-9',
        title: 'Define your activation metric',
        description: 'Pick ONE action that predicts retention (e.g., "invited 3 friends," "completed onboarding"). Write what it is and why you chose it.',
        type: 'text_input',
        points: 25,
        required: false,
        hint: 'Facebook found that users who added 7 friends in 10 days were far more likely to stay. What\'s YOUR "7 friends in 10 days"? Find it, then drive every user there.',
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
      },
      {
        id: '10-6',
        title: 'Create a viral referral program',
        description: 'Design and launch a "share to earn" referral system. Write the incentive structure and the shareable message for users.',
        type: 'text_input',
        points: 35,
        required: false,
        hint: 'Dropbox grew 3900% with a simple referral: "Get 500MB free for every friend you invite." What\'s your equivalent? Make sharing feel like doing a friend a favor, not selling.',
      },
      {
        id: '10-7',
        title: 'Set up uptime monitoring and alerts',
        description: 'Install monitoring (UptimeRobot, Sentry, or similar) so you know immediately if your site goes down. Upload a screenshot.',
        type: 'file_upload',
        points: 25,
        required: false,
        hint: 'Nothing kills a launch faster than your site crashing while traffic peaks. Set this up in 10 minutes BEFORE launch day, and sleep better.',
      },
      {
        id: '10-8',
        title: 'Create your launch day checklist',
        description: 'Write a minute-by-minute timeline for launch day. Social posts, email blast timing, who does what. Upload your checklist.',
        type: 'file_upload',
        points: 25,
        required: false,
        hint: 'Launch day is chaos unless it\'s planned. Pre-write ALL your posts and emails. On the day, your only job is to hit "post" and engage with every comment.',
      },
      {
        id: '10-9',
        title: 'Build a community onboarding flow',
        description: 'Design how new users will be welcomed into your community (Discord, Slack, forum). Write the welcome message and the "first thing to do" prompt.',
        type: 'text_input',
        points: 35,
        required: false,
        hint: 'A user who joins your community and makes ONE post is 5x more likely to become a long-term customer. Make that first interaction stupidly easy.',
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
