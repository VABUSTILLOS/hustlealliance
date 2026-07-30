import type { KeyInsight } from './gamification';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Category = 'Fundraising' | 'Marketing' | 'Product' | 'Leadership';

export interface LessonInsight {
  icon: string;
  title: string;
  insight: string;
}

export interface Lesson {
  slug: string;
  title: string;
  duration: string;
  videoUrl: string;
  content: string;
  locked?: boolean;
  insights?: LessonInsight[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface LearningPath {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  duration: string;
  totalMinutes: number;
  studentCount: number;
  thumbnail: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  modules: Module[];
  resources: { label: string; url: string }[];
  keyInsights: KeyInsight[];
  totalLessons: number;
  communitySpaceSlug?: string;
}

export const learningPaths: LearningPath[] = [
  {
    slug: 'fundraising-101',
    title: 'Fundraising 101',
    tagline: 'From pitch deck to term sheet',
    description:
      'Master the art of startup fundraising. Learn how to craft a compelling pitch, identify the right investors, run a tight process, and negotiate favorable terms — all from founders who have raised over $500M collectively.',
    category: 'Fundraising',
    difficulty: 'Beginner',
    duration: '4 weeks',
    totalMinutes: 210,
    studentCount: 842,
    totalLessons: 10,
    communitySpaceSlug: 'fundraising-hub',
    thumbnail:
      '/images/courses/fundraising-101.webp',
    author: {
      name: 'Marcus Chen',
      role: 'GP @ Horizon Ventures',
      avatar:
        '/images/avatars/marcuschen.jpg',
      bio: 'Former founder turned investor. Led seed rounds for 40+ startups totaling $120M+.',
    },
    keyInsights: [
      { icon: '💡', title: 'Investors bet on stories', insight: 'Your narrative matters more than your numbers in the first meeting. Nail your origin story.' },
      { icon: '🎯', title: 'Target the right VCs', insight: 'Not all money is good money. Research which funds invest in your stage, sector, and geography.' },
      { icon: '⏱️', title: 'Run a tight process', insight: 'Stack meetings within 2 weeks. Create FOMO with a clear deadline. Let investors compete.' },
      { icon: '📊', title: 'Know your numbers cold', insight: 'CAC, LTV, burn rate, runway — be ready to answer any metric question without hesitation.' },
      { icon: '🤝', title: 'Warm intros win', insight: 'Cold emails have a 1% hit rate. Warm introductions from portfolio founders get 80%+ response rates.' },
    ],
    modules: [
      {
        id: 'm1',
        title: 'Building Your Narrative',
        lessons: [
          {
            slug: 'intro-to-fundraising',
            title: 'Introduction to Fundraising',
            duration: '12 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            insights: [
              { icon: '💡', title: 'Money follows milestones', insight: 'Raise when you have momentum, not when you\'re desperate. Align each round with clear business achievements.' },
              { icon: '🎯', title: 'Stage matters', insight: 'Pre-seed is about the team. Seed is about early traction. Series A is about scalable unit economics.' },
              { icon: '🤝', title: 'Build relationships early', insight: 'Start talking to investors 6 months before you need to raise. Coffee meetings now = term sheets later.' },
            ],
            content: `## Why fundraising matters

Fundraising is not just about money — it's about finding partners who believe in your vision.

### Key takeaways:
- Align your raise with your business milestones
- Understand the different funding stages (Pre-seed, Seed, Series A)
- Build relationships before you need money

> "The best time to raise money is when you don't need it." — Every founder ever`,
          },
          {
            slug: 'crafting-your-story',
            title: 'Crafting Your Story',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## The art of storytelling

Investors hear hundreds of pitches. Your story is what makes them lean in.

### Frameworks to use:
1. **Problem → Solution → Why Now**
2. **Founder-Market Fit**
3. **Vision vs. Traction**`,
          },
          {
            slug: 'building-the-deck',
            title: 'Building the 12-Slide Deck',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## The 12-slide framework

A proven structure used by founders who raised $40M+ across our community.

1. Title
2. Problem
3. Solution
4. Why Now?
5. Market Size
6. Product
7. Traction
8. Business Model
9. Competition
10. Team
11. Financials
12. The Ask`,
          },
          {
            slug: 'pitch-practice',
            title: 'Pitch Practice & Feedback',
            duration: '30 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Practice makes perfect

Record yourself. Watch it back. Iterate.

### Common mistakes:
- Too much text on slides
- No clear ask
- Rambling answers to questions`,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Finding Investors',
        lessons: [
          {
            slug: 'investor-research',
            title: 'Investor Research & Targeting',
            duration: '15 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Build your target list

Not all money is good money. Find investors who add value.`,
          },
          {
            slug: 'warm-intros',
            title: 'Getting Warm Introductions',
            duration: '14 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## The power of warm intros

Cold emails have a 1% response rate. Warm intros: 80%.`,
          },
          {
            slug: 'first-meeting',
            title: 'Nailing the First Meeting',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## First impressions matter

Come prepared. Lead with traction. End with a clear next step.`,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Running the Process',
        lessons: [
          {
            slug: 'data-room',
            title: 'Setting Up Your Data Room',
            duration: '16 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## What goes in your data room

Organize everything investors need to diligence you quickly.`,
          },
          {
            slug: 'creating-fomo',
            title: 'Creating FOMO & Managing Timelines',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Build urgency

Stack your meetings. Create a deadline. Let investors compete.`,
          },
          {
            slug: 'term-sheets',
            title: 'Understanding Term Sheets',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Every clause, explained

Valuation, liquidation preference, anti-dilution, board seats — know what matters.`,
            locked: true,
          },
        ],
      },
    ],
    resources: [
      { label: 'Pitch Deck Template', url: '#' },
      { label: 'Investor CRM Spreadsheet', url: '#' },
      { label: 'Term Sheet Checklist', url: '#' },
    ],
  },
  {
    slug: 'growth-marketing',
    title: 'Growth Marketing',
    tagline: 'Zero-budget to $10K MRR',
    description:
      'Learn the exact growth playbooks used by 200+ founders to get their first 1,000 users. Covers content marketing, SEO, social media, and paid acquisition strategies that work on a bootstrap budget.',
    category: 'Marketing',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    totalMinutes: 288,
    studentCount: 623,
    totalLessons: 12,
    communitySpaceSlug: 'growth-hacking',
    thumbnail:
      '/images/courses/growth-marketing.webp',
    author: {
      name: 'Priya Patel',
      role: 'Head of Growth @ ScaleUp',
      avatar:
        '/images/avatars/priyap.jpg',
      bio: 'Scaled 3 startups from 0 to 100K+ users. Specializes in organic growth and community-led acquisition.',
    },
    keyInsights: [
      { icon: '🚀', title: 'Growth is systematic', insight: 'Sustainable growth comes from process, not hacks. Build repeatable acquisition loops.' },
      { icon: '📈', title: 'Find your North Star', insight: 'Identify the one metric that best captures your core value delivery. Everything flows from it.' },
      { icon: '✍️', title: 'Content compounds', insight: 'One great blog post can drive traffic for years. Build a content engine that scales.' },
      { icon: '🔍', title: 'SEO for bootstrappers', insight: 'You don\'t need a budget to rank. Target long-tail keywords your competitors ignore.' },
      { icon: '👥', title: 'Community is your moat', insight: 'Turn early users into evangelists. Word-of-mouth beats paid ads 10-to-1 on ROI.' },
    ],
    modules: [
      {
        id: 'm1',
        title: 'Growth Foundations',
        lessons: [
          {
            slug: 'growth-mindset',
            title: 'The Growth Mindset',
            duration: '10 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Growth is a system, not a hack

Sustainable growth comes from process, not one-off tactics.`,
          },
          {
            slug: 'defining-metrics',
            title: 'Defining Your North Star Metric',
            duration: '14 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Find the one metric that matters

For Airbnb it's nights booked. For you?`,
          },
          {
            slug: 'acquisition-channels',
            title: 'Mapping Acquisition Channels',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## 19 traction channels

Brian Balfour's framework for finding your growth engine.`,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Content & SEO',
        lessons: [
          {
            slug: 'content-strategy',
            title: 'Building a Content Engine',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Content that converts

Write for your customer, optimize for search.`,
          },
          {
            slug: 'seo-basics',
            title: 'SEO for Founders',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Rank without a budget

Technical SEO, on-page optimization, and link building for bootstrappers.`,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Social & Community',
        lessons: [
          {
            slug: 'social-media-engine',
            title: 'The Social Media Engine',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Build in public

How founders use Twitter, LinkedIn, and TikTok to grow their startups.`,
          },
          {
            slug: 'community-led-growth',
            title: 'Community-Led Growth',
            duration: '16 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Your users are your best marketers

Turn customers into evangelists.`,
          },
        ],
      },
    ],
    resources: [
      { label: 'Content Calendar Template', url: '#' },
      { label: 'SEO Keyword Research Guide', url: '#' },
    ],
  },
  {
    slug: 'product-led-growth',
    title: 'Product-Led Growth',
    tagline: 'Let your product do the selling',
    description:
      'Transition from sales-led to product-led growth. Learn how to design onboarding flows, freemium models, and viral loops that turn your product into your #1 acquisition channel.',
    category: 'Product',
    difficulty: 'Advanced',
    duration: '5 weeks',
    totalMinutes: 254,
    studentCount: 495,
    totalLessons: 8,
    communitySpaceSlug: 'ai-ml-builders',
    thumbnail:
      '/images/courses/product-led-growth.webp',
    author: {
      name: 'Devon Mitchell',
      role: 'CEO @ Flux Studio',
      avatar:
        '/images/avatars/devonm.jpg',
      bio: 'Built and sold two PLG companies. Advises YC startups on product-led strategy.',
    },
    keyInsights: [
      { icon: '🔄', title: 'Your product IS your sales team', insight: 'When users can try before they buy, adoption skyrockets. Design for self-serve discovery.' },
      { icon: '✨', title: 'The "Aha" moment is everything', insight: 'Map the shortest path from signup to the moment users first experience your core value.' },
      { icon: '🎨', title: 'Onboarding is your conversion funnel', insight: 'Progressive disclosure beats feature dumps. Show only what users need at each step.' },
      { icon: '🦠', title: 'Virality by design', insight: 'Build sharing mechanisms directly into the product experience — not bolted on as an afterthought.' },
      { icon: '💰', title: 'Freemium that converts', insight: 'Give enough value for free to build habit, then charge for power, team, and enterprise features.' },
    ],
    modules: [
      {
        id: 'm1',
        title: 'PLG Fundamentals',
        lessons: [
          {
            slug: 'what-is-plg',
            title: 'What is Product-Led Growth?',
            duration: '12 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## The end of the sales demo

When your product sells itself, everything changes.`,
          },
          {
            slug: 'plg-vs-slg',
            title: 'PLG vs. Sales-Led: When to Switch',
            duration: '16 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Not every company should be PLG

Understand when product-led makes sense for your business.`,
          },
          {
            slug: 'plg-metrics',
            title: 'PLG Metrics That Matter',
            duration: '14 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## TTV, PQL, NPS, and more

The key metrics for a product-led organization.`,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Onboarding & Activation',
        lessons: [
          {
            slug: 'aha-moment',
            title: 'Finding Your "Aha" Moment',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## The moment users "get it"

Map the shortest path from signup to value.`,
          },
          {
            slug: 'onboarding-flows',
            title: 'Designing Killer Onboarding',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Progressive disclosure

Show just enough to get users to the aha moment.`,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Virality & Loops',
        lessons: [
          {
            slug: 'viral-loops',
            title: 'Engineering Viral Loops',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Build sharing into the product

The best growth comes from within.`,
          },
          {
            slug: 'freemium-models',
            title: 'Freemium & Pricing Strategy',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## When to charge and how much

Find the pricing sweet spot that maximizes conversion.`,
          },
        ],
      },
    ],
    resources: [
      { label: 'PLG Scorecard Template', url: '#' },
      { label: 'Onboarding Audit Checklist', url: '#' },
    ],
  },
  {
    slug: 'leadership-foundations',
    title: 'Leadership Foundations',
    tagline: 'Lead your startup with confidence',
    description:
      'Transition from builder to leader. Master the art of hiring, managing, and scaling a team while maintaining your startup culture and velocity.',
    category: 'Leadership',
    difficulty: 'Intermediate',
    duration: '5 weeks',
    totalMinutes: 240,
    studentCount: 521,
    totalLessons: 9,
    communitySpaceSlug: 'leader-circle',
    thumbnail:
      '/images/courses/leadership-foundations.webp',
    author: {
      name: 'Sarah Okonkwo',
      role: 'CEO @ TalentBridge',
      avatar:
        '/images/avatars/sarahk.jpg',
      bio: 'Scaled engineering teams at Google, Stripe, and two YC startups. Author of "The Founder\'s Guide to Leadership."',
    },
    keyInsights: [
      { icon: '🧭', title: 'Culture is strategy', insight: 'The team you build IS the company you build. Hire for values first, skills second.' },
      { icon: '🎙️', title: 'Communication scales everything', insight: 'Over-communicate by 10x. Your team can\'t read your mind, especially as you grow past 20 people.' },
      { icon: '🔄', title: 'Feedback is a gift', insight: 'Build a culture of radical candor. The most successful founders give and receive feedback daily.' },
      { icon: '⚡', title: 'Delegate or die', insight: 'Your job as CEO is to work yourself out of every job. Empower your team to make decisions without you.' },
      { icon: '🌱', title: 'Grow yourself first', insight: 'Your startup can only grow as fast as you do. Invest in coaching, therapy, and peer groups.' },
    ],
    modules: [
      {
        id: 'm1',
        title: 'The Founder-to-Leader Transition',
        lessons: [
          {
            slug: 'from-builder-to-leader',
            title: 'From Builder to Leader',
            duration: '15 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## The hardest transition in startups
Going from doing everything yourself to leading others who do it for you is the make-or-break moment for founders.
### Key shifts:
- From maker to multiplier
- From individual to team output
- From tactics to strategy`,
          },
          {
            slug: 'defining-your-culture',
            title: 'Defining Your Startup Culture',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Culture happens with or without you
If you don't intentionally shape it, it shapes itself — and usually not how you'd want.
### Culture frameworks:
1. Define 3-5 core values that are actually enforceable
2. Create rituals that reinforce those values
3. Hire and fire based on cultural alignment`,
          },
          {
            slug: 'self-awareness',
            title: 'Leadership Self-Awareness',
            duration: '14 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Know yourself to lead others
The best leaders are relentlessly self-aware. They know their strengths, blind spots, and emotional triggers.`,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Hiring & Team Building',
        lessons: [
          {
            slug: 'hiring-your-first-10',
            title: 'Hiring Your First 10 Employees',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Your first hires define your company
Each of your first 10 hires brings 10% of your culture. Choose wrong and recovery is expensive.`,
          },
          {
            slug: 'interviewing-like-a-pro',
            title: 'Interviewing Like a Pro',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Structured interviews reduce bias
Create a consistent interview process with clear scorecards. Focus on demonstrated ability over pedigree.`,
          },
          {
            slug: 'compensation-and-equity',
            title: 'Compensation & Equity',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Pay fairly, incentivize smartly
Understand market comp, equity vesting schedules, and how to use both to attract and retain top talent.`,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Managing & Scaling Teams',
        lessons: [
          {
            slug: 'one-on-ones',
            title: 'Mastering the 1:1',
            duration: '16 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## The most powerful 30 minutes of your week
A great 1:1 is not a status update. It's a coaching session, a trust builder, and your early warning system.`,
          },
          {
            slug: 'performance-reviews',
            title: 'Performance Reviews That Work',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## Reviews shouldn't be a surprise
Build a continuous feedback culture so the annual review is just a summary of conversations you've already had.`,
          },
          {
            slug: 'scaling-beyond-50',
            title: 'Scaling Beyond 50 People',
            duration: '24 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `## The rules change at every order of magnitude
What works at 10 breaks at 50. What works at 50 breaks at 200. Learn to evolve your leadership style.`,
            locked: true,
          },
        ],
      },
    ],
    resources: [
      { label: 'Culture Deck Template', url: '#' },
      { label: 'Hiring Scorecard Template', url: '#' },
      { label: '1:1 Meeting Agenda', url: '#' },
    ],
  },
];

export const categories: Category[] = ['Fundraising', 'Marketing', 'Product', 'Leadership'];
