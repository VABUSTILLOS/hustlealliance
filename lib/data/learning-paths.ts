export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Category = 'Fundraising' | 'Marketing' | 'Product' | 'Leadership';

export interface Lesson {
  slug: string;
  title: string;
  duration: string;
  videoUrl: string;
  content: string;
  locked?: boolean;
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
  thumbnail: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  modules: Module[];
  resources: { label: string; url: string }[];
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
    thumbnail:
      'https://images.unsplash.com/photo-1553484771-371e845efba1?w=800&h=500&fit=crop',
    author: {
      name: 'Marcus Chen',
      role: 'GP @ Horizon Ventures',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
      bio: 'Former founder turned investor. Led seed rounds for 40+ startups totaling $120M+.',
    },
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
    thumbnail:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    author: {
      name: 'Priya Patel',
      role: 'Head of Growth @ ScaleUp',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
      bio: 'Scaled 3 startups from 0 to 100K+ users. Specializes in organic growth and community-led acquisition.',
    },
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
    thumbnail:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    author: {
      name: 'Devon Mitchell',
      role: 'CEO @ Flux Studio',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face',
      bio: 'Built and sold two PLG companies. Advises YC startups on product-led strategy.',
    },
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
];

export const categories: Category[] = ['Fundraising', 'Marketing', 'Product', 'Leadership'];
