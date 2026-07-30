import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');
  await prisma.$connect();

  // ==================== USERS ====================
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hustlealliance.com' },
    update: {},
    create: {
      email: 'admin@hustlealliance.com',
      name: 'Admin',
      username: 'admin',
      role: 'ADMIN',
      membershipTier: 'PRO',
      avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Admin&backgroundColor=dc2626',
      bio: 'Platform administrator',
    },
  });

  const instructors = await Promise.all([
    prisma.user.upsert({
      where: { email: 'marcus@hustlealliance.com' },
      update: { membershipTier: 'PRO' },
      create: {
        email: 'marcus@hustlealliance.com',
        name: 'Marcus Chen',
        username: 'marcuschen',
        role: 'INSTRUCTOR',
        membershipTier: 'PRO',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
        bio: 'Former founder turned investor. Led seed rounds for 40+ startups totaling $120M+.',
        headline: 'GP @ Horizon Ventures',
      },
    }),
    prisma.user.upsert({
      where: { email: 'priya@hustlealliance.com' },
      update: { membershipTier: 'PRO' },
      create: {
        email: 'priya@hustlealliance.com',
        name: 'Priya Patel',
        username: 'priyap',
        role: 'INSTRUCTOR',
        membershipTier: 'PRO',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
        bio: 'Scaled 3 startups from 0 to 100K+ users. Specializes in organic growth and community-led acquisition.',
        headline: 'Head of Growth @ ScaleUp',
      },
    }),
    prisma.user.upsert({
      where: { email: 'devon@hustlealliance.com' },
      update: { membershipTier: 'PRO' },
      create: {
        email: 'devon@hustlealliance.com',
        name: 'Devon Mitchell',
        username: 'devonm',
        role: 'INSTRUCTOR',
        membershipTier: 'PRO',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face',
        bio: 'Built and sold two PLG companies. Advises YC startups on product-led strategy.',
        headline: 'CEO @ Flux Studio',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@hustlealliance.com' },
      update: { membershipTier: 'PRO' },
      create: {
        email: 'sarah@hustlealliance.com',
        name: 'Sarah Okonkwo',
        username: 'sarahk',
        role: 'INSTRUCTOR',
        membershipTier: 'PRO',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=96&h=96&fit=crop&crop=face',
        bio: 'Scaled engineering teams at Google, Stripe, and two YC startups.',
        headline: 'CEO @ TalentBridge',
      },
    }),
  ]);

  const [marcus, priya, devon, sarah] = instructors;

  // Demo student
  const demoStudent = await prisma.user.upsert({
    where: { email: 'alex@hustlealliance.com' },
    update: {},
    create: {
      email: 'alex@hustlealliance.com',
      name: 'Alex Kowalski',
      username: 'alexk',
      role: 'STUDENT',
      membershipTier: 'FREE',
      avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Alex+Kowalski&backgroundColor=ea580c',
      bio: 'Serial founder. Previously built and sold a logistics SaaS.',
      headline: 'Building the future of recruiting with AI',
    },
  });

  console.log('✅ Users created');

  // ==================== CATEGORIES ====================
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'fundraising' }, update: {}, create: { name: 'Fundraising', slug: 'fundraising', description: 'Master the art of startup fundraising from pitch deck to term sheet' } }),
    prisma.category.upsert({ where: { slug: 'marketing' }, update: {}, create: { name: 'Marketing', slug: 'marketing', description: 'Growth marketing strategies for bootstrapped startups' } }),
    prisma.category.upsert({ where: { slug: 'product' }, update: {}, create: { name: 'Product', slug: 'product', description: 'Product-led growth and development strategies' } }),
    prisma.category.upsert({ where: { slug: 'leadership' }, update: {}, create: { name: 'Leadership', slug: 'leadership', description: 'Leadership and team building for founders' } }),
    prisma.category.upsert({ where: { slug: 'sales' }, update: {}, create: { name: 'Sales', slug: 'sales', description: 'B2B sales, negotiation, and closing deals' } }),
    prisma.category.upsert({ where: { slug: 'finance' }, update: {}, create: { name: 'Finance', slug: 'finance', description: 'Financial modeling, metrics, and runway management' } }),
  ]);

  const [catFundraising, catMarketing, catProduct, catLeadership, catSales, catFinance] = categories;
  console.log('✅ Categories created');

  // ==================== COURSES ====================
  const courses = [
    {
      title: 'Fundraising 101',
      slug: 'fundraising-101',
      tagline: 'From pitch deck to term sheet',
      description: 'Master the art of startup fundraising. Learn how to craft a compelling pitch, identify the right investors, run a tight process, and negotiate favorable terms.',
      difficulty: 'BEGINNER' as const,
      accessLevel: 'BASIC' as const,
      durationWeeks: 4,
      totalMinutes: 210,
      studentCount: 842,
      categoryId: catFundraising.id,
      instructorId: marcus.id,
      communitySpaceSlug: 'fundraising-hub',
      thumbnail: '/images/courses/fundraising-101.webp',
      modules: [
        {
          title: 'Building Your Narrative',
          lessons: [
            { title: 'Introduction to Fundraising', slug: 'intro-to-fundraising', durationMinutes: 12, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Why fundraising matters\n\nFundraising is not just about money — it\'s about finding partners who believe in your vision.\n\n### Key takeaways:\n- Align your raise with your business milestones\n- Understand the different funding stages (Pre-seed, Seed, Series A)\n- Build relationships before you need money\n\n> "The best time to raise money is when you don\'t need it." — Every founder ever' },
            { title: 'Crafting Your Story', slug: 'crafting-your-story', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The art of storytelling\n\nInvestors hear hundreds of pitches. Your story is what makes them lean in.\n\n### Frameworks to use:\n1. **Problem → Solution → Why Now**\n2. **Founder-Market Fit**\n3. **Vision vs. Traction**' },
            { title: 'Building the 12-Slide Deck', slug: 'building-the-deck', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The 12-slide framework\n\nA proven structure used by founders who raised $40M+. \n\n1. Title 2. Problem 3. Solution 4. Why Now? 5. Market Size 6. Product 7. Traction 8. Business Model 9. Competition 10. Team 11. Financials 12. The Ask' },
            { title: 'Pitch Practice & Feedback', slug: 'pitch-practice', durationMinutes: 30, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Practice makes perfect\n\nRecord yourself. Watch it back. Iterate.\n\n### Common mistakes:\n- Too much text on slides\n- No clear ask\n- Rambling answers to questions' },
          ],
        },
        {
          title: 'Finding Investors',
          lessons: [
            { title: 'Investor Research & Targeting', slug: 'investor-research', durationMinutes: 15, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Build your target list\n\nNot all money is good money. Find investors who add value.' },
            { title: 'Getting Warm Introductions', slug: 'warm-intros', durationMinutes: 14, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The power of warm intros\n\nCold emails have a 1% response rate. Warm intros: 80%.' },
            { title: 'Nailing the First Meeting', slug: 'first-meeting', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## First impressions matter\n\nCome prepared. Lead with traction. End with a clear next step.' },
          ],
        },
        {
          title: 'Running the Process',
          lessons: [
            { title: 'Setting Up Your Data Room', slug: 'data-room', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## What goes in your data room\n\nOrganize everything investors need to diligence you quickly.' },
            { title: 'Creating FOMO & Managing Timelines', slug: 'creating-fomo', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Build urgency\n\nStack your meetings. Create a deadline. Let investors compete.' },
            { title: 'Understanding Term Sheets', slug: 'term-sheets', durationMinutes: 25, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Every clause, explained\n\nValuation, liquidation preference, anti-dilution, board seats — know what matters.' },
          ],
        },
      ],
    },
    {
      title: 'Growth Marketing',
      slug: 'growth-marketing',
      tagline: 'Zero-budget to $10K MRR',
      description: 'Learn the exact growth playbooks used by 200+ founders to get their first 1,000 users. Covers content marketing, SEO, social media, and paid acquisition strategies.',
      difficulty: 'INTERMEDIATE' as const,
      accessLevel: 'PRO' as const,
      durationWeeks: 6,
      totalMinutes: 288,
      studentCount: 623,
      categoryId: catMarketing.id,
      instructorId: priya.id,
      communitySpaceSlug: 'growth-hacking',
      thumbnail: '/images/courses/growth-marketing.webp',
      modules: [
        {
          title: 'Growth Foundations',
          lessons: [
            { title: 'The Growth Mindset', slug: 'growth-mindset', durationMinutes: 10, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Growth is a system, not a hack\n\nSustainable growth comes from process, not one-off tactics.' },
            { title: 'Defining Your North Star Metric', slug: 'defining-metrics', durationMinutes: 14, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Find the one metric that matters\n\nFor Airbnb it\'s nights booked. For you?' },
            { title: 'Mapping Acquisition Channels', slug: 'acquisition-channels', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## 19 traction channels\n\nBrian Balfour\'s framework for finding your growth engine.' },
          ],
        },
        {
          title: 'Content & SEO',
          lessons: [
            { title: 'Building a Content Engine', slug: 'content-strategy', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Content that converts\n\nWrite for your customer, optimize for search.' },
            { title: 'SEO for Founders', slug: 'seo-basics', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Rank without a budget\n\nTechnical SEO, on-page optimization, and link building for bootstrappers.' },
          ],
        },
        {
          title: 'Social & Community',
          lessons: [
            { title: 'The Social Media Engine', slug: 'social-media-engine', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Build in public\n\nHow founders use Twitter, LinkedIn, and TikTok to grow their startups.' },
            { title: 'Community-Led Growth', slug: 'community-led-growth', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Your users are your best marketers\n\nTurn customers into evangelists.' },
          ],
        },
      ],
    },
    {
      title: 'Product-Led Growth',
      slug: 'product-led-growth',
      tagline: 'Let your product do the selling',
      description: 'Transition from sales-led to product-led growth. Learn how to design onboarding flows, freemium models, and viral loops.',
      difficulty: 'ADVANCED' as const,
      accessLevel: 'PRO' as const,
      durationWeeks: 5,
      totalMinutes: 254,
      studentCount: 495,
      categoryId: catProduct.id,
      instructorId: devon.id,
      communitySpaceSlug: 'ai-ml-builders',
      thumbnail: '/images/courses/product-led-growth.webp',
      modules: [
        {
          title: 'PLG Fundamentals',
          lessons: [
            { title: 'What is Product-Led Growth?', slug: 'what-is-plg', durationMinutes: 12, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The end of the sales demo\n\nWhen your product sells itself, everything changes.' },
            { title: 'PLG vs. Sales-Led: When to Switch', slug: 'plg-vs-slg', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Not every company should be PLG\n\nUnderstand when product-led makes sense.' },
            { title: 'PLG Metrics That Matter', slug: 'plg-metrics', durationMinutes: 14, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## TTV, PQL, NPS, and more\n\nThe key metrics for a product-led organization.' },
          ],
        },
        {
          title: 'Onboarding & Activation',
          lessons: [
            { title: 'Finding Your "Aha" Moment', slug: 'aha-moment', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The moment users "get it"\n\nMap the shortest path from signup to value.' },
            { title: 'Designing Killer Onboarding', slug: 'onboarding-flows', durationMinutes: 25, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Progressive disclosure\n\nShow just enough to get users to the aha moment.' },
          ],
        },
        {
          title: 'Virality & Loops',
          lessons: [
            { title: 'Engineering Viral Loops', slug: 'viral-loops', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Build sharing into the product\n\nThe best growth comes from within.' },
            { title: 'Freemium & Pricing Strategy', slug: 'freemium-models', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## When to charge and how much\n\nFind the pricing sweet spot that maximizes conversion.' },
          ],
        },
      ],
    },
    {
      title: 'Leadership Foundations',
      slug: 'leadership-foundations',
      tagline: 'Lead your startup with confidence',
      description: 'Transition from builder to leader. Master the art of hiring, managing, and scaling a team while maintaining your startup culture and velocity.',
      difficulty: 'INTERMEDIATE' as const,
      accessLevel: 'BASIC' as const,
      durationWeeks: 5,
      totalMinutes: 240,
      studentCount: 521,
      categoryId: catLeadership.id,
      instructorId: sarah.id,
      communitySpaceSlug: 'saas-founders',
      thumbnail: '/images/courses/leadership-foundations.webp',
      modules: [
        {
          title: 'The Founder-to-Leader Transition',
          lessons: [
            { title: 'From Builder to Leader', slug: 'from-builder-to-leader', durationMinutes: 15, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The hardest transition in startups\n\nGoing from doing everything yourself to leading others. From maker to multiplier.' },
            { title: 'Defining Your Startup Culture', slug: 'defining-your-culture', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Culture happens with or without you\n\nDefine 3-5 core values. Create rituals. Hire and fire based on cultural alignment.' },
            { title: 'Leadership Self-Awareness', slug: 'self-awareness', durationMinutes: 14, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Know yourself to lead others\n\nThe best leaders are relentlessly self-aware.' },
          ],
        },
        {
          title: 'Hiring & Team Building',
          lessons: [
            { title: 'Hiring Your First 10 Employees', slug: 'hiring-your-first-10', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Your first hires define your company\n\nEach of your first 10 hires brings 10% of your culture.' },
            { title: 'Interviewing Like a Pro', slug: 'interviewing-like-a-pro', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Structured interviewing\n\nUse scorecards, work samples, and values-based questions.' },
            { title: 'Performance Reviews That Work', slug: 'performance-reviews', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Annual reviews are broken\n\nContinuous feedback beats annual reviews. Here\'s how.' },
          ],
        },
        {
          title: 'Scaling Yourself',
          lessons: [
            { title: 'Delegation & Empowerment', slug: 'delegation', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Delegate or die\n\nWork yourself out of every job. Empower your team.' },
            { title: 'Building a Leadership Team', slug: 'leadership-team', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## From founder-led to team-led\n\nHiring VPs and building executive alignment.' },
            { title: 'Founder Wellness & Resilience', slug: 'founder-wellness', durationMinutes: 15, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## You are your startup\'s most important asset\n\nTherapy, exercise, sleep — they\'re part of the job.' },
          ],
        },
      ],
    },
    {
      title: 'Sales for Founders',
      slug: 'sales-for-founders',
      tagline: 'Close your first 50 deals',
      description: 'Learn founder-led sales from prospecting to close. Master cold outreach, discovery calls, objection handling, and negotiation — without feeling like a salesperson.',
      difficulty: 'BEGINNER' as const,
      accessLevel: 'FREE' as const,
      durationWeeks: 4,
      totalMinutes: 225,
      studentCount: 736,
      categoryId: catSales.id,
      instructorId: marcus.id,
      communitySpaceSlug: 'saas-founders',
      thumbnail: '/images/courses/sales-for-founders.webp',
      modules: [
        {
          title: 'Foundations of Founder-Led Sales',
          lessons: [
            { title: 'Why Founders Must Sell First', slug: 'founder-sells-first', durationMinutes: 14, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Nobody sells your product better than you\n\nBefore hiring a sales team, you need to master the craft yourself. This is how you discover what actually resonates.' },
            { title: 'Building Your Ideal Customer Profile', slug: 'icp-building', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Don\'t sell to everyone\n\nDefine your ICP with precision: firmographics, pain points, budget, and buying authority.' },
            { title: 'The Founder\'s Sales Stack', slug: 'sales-stack', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Tools don\'t sell — but they help\n\nCRM, email sequencing, LinkedIn automation, and call recording. The lean founder\'s toolkit.' },
          ],
        },
        {
          title: 'Outbound Prospecting',
          lessons: [
            { title: 'Cold Outreach That Gets Replies', slug: 'cold-outreach', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The art of the cold email\n\nSubject lines that get opened. Bodies that get replies. Timing that matters.' },
            { title: 'LinkedIn & Social Selling', slug: 'social-selling', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Build relationships before you pitch\n\nContent → Connection → Conversation → Close. The 4 C\'s of social selling.' },
            { title: 'Referral Engine', slug: 'referral-engine', durationMinutes: 15, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Your happiest customers are your best salespeople\n\nHow to systematically generate warm introductions.' },
          ],
        },
        {
          title: 'Closing & Negotiation',
          lessons: [
            { title: 'Running Killer Discovery Calls', slug: 'discovery-calls', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Ask, don\'t tell\n\nThe best sales calls are 80% listening. Master the MEDDIC framework.' },
            { title: 'Objection Handling Playbook', slug: 'objection-handling', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Every objection is a question in disguise\n\nPrice, timing, competition, authority — scripted responses for every scenario.' },
            { title: 'Negotiation Mastery', slug: 'negotiation-mastery', durationMinutes: 25, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Win-win or no deal\n\nAnchoring, concessions, and when to walk away. Based on Chris Voss\'s FBI negotiation tactics.' },
          ],
        },
      ],
    },
    {
      title: 'Startup Finance 101',
      slug: 'startup-finance-101',
      tagline: 'Master your startup\'s financial health',
      description: 'Go from spreadsheet-phobic to financially fluent. Learn to build financial models, manage runway, understand cap tables, and communicate with investors about the numbers that matter.',
      difficulty: 'INTERMEDIATE' as const,
      accessLevel: 'BASIC' as const,
      durationWeeks: 5,
      totalMinutes: 270,
      studentCount: 512,
      categoryId: catFinance.id,
      instructorId: devon.id,
      communitySpaceSlug: 'fundraising-hub',
      thumbnail: '/images/courses/startup-finance-101.webp',
      modules: [
        {
          title: 'Financial Foundations',
          lessons: [
            { title: 'Startup Accounting 101', slug: 'accounting-101', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Debits, credits, and why they matter\n\nRevenue recognition, accrual vs cash basis, and the three financial statements.' },
            { title: 'Unit Economics Demystified', slug: 'unit-economics', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## CAC, LTV, and everything in between\n\nHow to calculate, track, and optimize your key unit economics.' },
            { title: 'Building Your First Financial Model', slug: 'first-financial-model', durationMinutes: 30, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## From zero to a working model\n\nStep-by-step: revenue projections, headcount planning, expense forecasting. Template included.' },
          ],
        },
        {
          title: 'Metrics & KPIs',
          lessons: [
            { title: 'SaaS Metrics That Matter', slug: 'saas-metrics', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## MRR, ARR, Churn, NRR, GRR, Burn Multiple\n\nWhich metrics investors actually care about and how to improve them.' },
            { title: 'Building Investor Dashboards', slug: 'investor-dashboards', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Speak the language of investors\n\nHow to present your numbers in a way that builds confidence.' },
            { title: 'Runway & Cash Management', slug: 'runway-management', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Cash is oxygen\n\nExtending runway, managing burn rate, and knowing when to raise vs. when to cut.' },
          ],
        },
        {
          title: 'Cap Tables & Fundraising Math',
          lessons: [
            { title: 'Cap Table Fundamentals', slug: 'cap-table-basics', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Who owns what and why\n\nAuthorized shares, outstanding shares, option pools, and dilution — explained simply.' },
            { title: 'Valuation & Deal Terms', slug: 'valuation-deal-terms', durationMinutes: 24, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Pre-money, post-money, and liquidation preferences\n\nHow term sheet math actually works with real examples.' },
            { title: 'Tax & Compliance for Startups', slug: 'tax-compliance', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Don\'t let the IRS kill your startup\n\nEntity selection, R&D tax credits, 409A valuations, and common tax pitfalls.' },
          ],
        },
      ],
    },
    {
      title: 'AI Tools for Founders',
      slug: 'ai-tools-for-founders',
      tagline: '10x your productivity with AI',
      description: 'Practical AI for founders who don\'t code. Learn to leverage ChatGPT, Claude, Midjourney, and 20+ AI tools across marketing, sales, product, and operations.',
      difficulty: 'BEGINNER' as const,
      accessLevel: 'FREE' as const,
      durationWeeks: 3,
      totalMinutes: 168,
      studentCount: 1089,
      categoryId: catProduct.id,
      instructorId: devon.id,
      communitySpaceSlug: 'ai-ml-builders',
      thumbnail: '/images/courses/ai-tools-for-founders.webp',
      modules: [
        {
          title: 'AI Fundamentals for Founders',
          lessons: [
            { title: 'What AI Can (and Can\'t) Do Today', slug: 'ai-capabilities', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Cut through the hype\n\nLLMs, image generation, code assistants — what\'s production-ready and what\'s still research.' },
            { title: 'Prompt Engineering for Founders', slug: 'prompt-engineering', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The single most important skill of 2024\n\nChain-of-thought, few-shot, role prompting — templates for every business task.' },
            { title: 'Building Your AI Stack', slug: 'ai-stack', durationMinutes: 14, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The 10 tools every founder needs\n\nFrom ChatGPT Teams to Claude Projects to Perplexity — build your AI toolkit.' },
          ],
        },
        {
          title: 'AI for Marketing & Content',
          lessons: [
            { title: 'AI-Powered Content Creation', slug: 'ai-content', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Blog posts, social content, and newsletters at 10x speed\n\nUsing AI as your first draft writer — with your voice and expertise.' },
            { title: 'AI for SEO & Market Research', slug: 'ai-seo-research', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Keyword research, competitor analysis, and content gaps\n\nHow Perplexity and ChatGPT can replace expensive research tools.' },
            { title: 'AI Design & Brand Assets', slug: 'ai-design', durationMinutes: 15, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## From Midjourney to Canva AI\n\nGenerate logos, social graphics, pitch deck slides, and ad creatives in minutes.' },
          ],
        },
        {
          title: 'AI for Operations & Product',
          lessons: [
            { title: 'AI for Customer Support', slug: 'ai-support', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Chatbots that actually work\n\nBuild a knowledge base, train custom GPTs, and automate 80% of support tickets.' },
            { title: 'AI-Assisted Product Development', slug: 'ai-product-dev', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## From PRD to prototype faster\n\nUsing AI for spec writing, wireframing, user story generation, and even no-code MVPs.' },
            { title: 'Automating Back-Office with AI', slug: 'ai-backoffice', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## HR, legal, accounting, and operations\n\nAI tools that replace 3 headcount for early-stage startups.' },
          ],
        },
      ],
    },
    {
      title: 'Design Thinking for Startups',
      slug: 'design-thinking',
      tagline: 'Build products people love',
      description: 'Learn the human-centered design process that powers Apple, Airbnb, and Stripe. From user research to prototyping to usability testing — without a design background.',
      difficulty: 'INTERMEDIATE' as const,
      accessLevel: 'BASIC' as const,
      durationWeeks: 4,
      totalMinutes: 232,
      studentCount: 394,
      categoryId: catProduct.id,
      instructorId: priya.id,
      communitySpaceSlug: 'saas-founders',
      thumbnail: '/images/courses/design-thinking.webp',
      modules: [
        {
          title: 'Empathize & Define',
          lessons: [
            { title: 'Introduction to Design Thinking', slug: 'intro-design-thinking', durationMinutes: 14, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Design is not how it looks — it\'s how it works\n\nThe 5-stage design thinking process and how it applies to startups.' },
            { title: 'User Research on a Budget', slug: 'user-research', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## You are not your user\n\nInterviews, surveys, observation, and analytics — how to understand real user needs without a research team.' },
            { title: 'Defining the Problem Statement', slug: 'problem-statement', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## A problem well-stated is half-solved\n\nHow to frame problems, create personas, and write Jobs-to-be-Done statements.' },
          ],
        },
        {
          title: 'Ideate & Prototype',
          lessons: [
            { title: 'Brainstorming That Actually Works', slug: 'brainstorming', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Quantity over quality (at first)\n\nBrainwriting, crazy 8s, SCAMPER, and other ideation techniques that get results.' },
            { title: 'Rapid Prototyping', slug: 'rapid-prototyping', durationMinutes: 24, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## From idea to clickable prototype in hours\n\nPaper prototypes, wireframes, and high-fidelity mockups with Figma. No design skills required.' },
          ],
        },
        {
          title: 'Test & Iterate',
          lessons: [
            { title: 'Usability Testing 101', slug: 'usability-testing', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Watch users break your product\n\n5-user rule, think-aloud protocol, and how to run tests remotely with real users.' },
            { title: 'Iterating with Data', slug: 'iterating-data', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Kill your darlings\n\nHow to prioritize feedback, run A/B tests, and make data-driven design decisions.' },
            { title: 'Building a Design Culture', slug: 'design-culture', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Design is everyone\'s job\n\nHow to embed design thinking into your startup\'s DNA — even with zero designers on staff.' },
          ],
        },
      ],
    },
    {
      title: 'Remote Leadership',
      slug: 'remote-leadership',
      tagline: 'Build and scale distributed teams',
      description: 'Master the art of leading remote and hybrid teams. Covers async communication, remote culture, distributed hiring, and keeping teams aligned across time zones.',
      difficulty: 'ADVANCED' as const,
      accessLevel: 'PRO' as const,
      durationWeeks: 5,
      totalMinutes: 278,
      studentCount: 287,
      categoryId: catLeadership.id,
      instructorId: sarah.id,
      communitySpaceSlug: 'saas-founders',
      thumbnail: '/images/courses/remote-leadership.webp',
      modules: [
        {
          title: 'Remote-First Mindset',
          lessons: [
            { title: 'Remote vs. Hybrid vs. Office', slug: 'remote-models', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Pick your model and commit\n\nThe pros and cons of each approach. Why "hybrid with optional remote" is the worst of both worlds.' },
            { title: 'Async Communication Mastery', slug: 'async-communication', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Default to async\n\nWriting-first culture, decision memos, and when to actually schedule a meeting.' },
            { title: 'Remote Tooling & Infrastructure', slug: 'remote-tooling', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The digital HQ\n\nSlack/Teams, Notion/Confluence, Loom, Miro, and the tools that make remote work actually work.' },
          ],
        },
        {
          title: 'Building Remote Culture',
          lessons: [
            { title: 'Culture Without a Water Cooler', slug: 'remote-culture', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Intentional culture > accidental culture\n\nHow to build connection, trust, and belonging when nobody shares a physical space.' },
            { title: 'Running Effective Remote Meetings', slug: 'remote-meetings', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Most meetings should be emails\n\nThe 6 types of meetings worth having, and how to run each one flawlessly on Zoom.' },
            { title: 'Remote Onboarding That Works', slug: 'remote-onboarding', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## First 90 days, fully remote\n\nStructured onboarding plans, buddy systems, and making new hires feel welcome from day one.' },
          ],
        },
        {
          title: 'Distributed Team Management',
          lessons: [
            { title: 'Hiring Across Borders', slug: 'global-hiring', durationMinutes: 24, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The world is your talent pool\n\nEORs, contractors, compliance, and compensation strategies for global teams.' },
            { title: 'Performance Management at Scale', slug: 'remote-performance', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Measure outcomes, not hours\n\nOKRs, 360 reviews, and career development frameworks for distributed teams.' },
            { title: 'Avoiding Burnout in Remote Teams', slug: 'remote-burnout', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## The always-on trap\n\nSetting boundaries, modeling healthy behavior, and building sustainable remote work practices.' },
          ],
        },
      ],
    },
    {
      title: 'Content Marketing Mastery',
      slug: 'content-marketing-mastery',
      tagline: 'Build an audience that grows your startup',
      description: 'Learn to create content that attracts, converts, and retains customers. Covers blogging, newsletters, social media, podcasts, and video — all on a bootstrap budget.',
      difficulty: 'BEGINNER' as const,
      accessLevel: 'FREE' as const,
      durationWeeks: 6,
      totalMinutes: 310,
      studentCount: 847,
      categoryId: catMarketing.id,
      instructorId: priya.id,
      communitySpaceSlug: 'growth-hacking',
      thumbnail: '/images/courses/content-marketing-mastery.webp',
      modules: [
        {
          title: 'Content Strategy Foundations',
          lessons: [
            { title: 'Why Content Marketing Wins', slug: 'why-content', durationMinutes: 16, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Content compounds\n\nHow content marketing beats paid ads over time. The flywheel: content → traffic → trust → customers.' },
            { title: 'Defining Your Content Niche', slug: 'content-niche', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Be the best answer on the internet for one thing\n\nHow to find your unique angle, voice, and positioning in a crowded content landscape.' },
            { title: 'Building a Content Calendar', slug: 'content-calendar', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Consistency beats intensity\n\nHow to plan, batch, and schedule content so you never miss a publishing date.' },
          ],
        },
        {
          title: 'Written Content',
          lessons: [
            { title: 'SEO Blogging That Ranks', slug: 'seo-blogging', durationMinutes: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Write for humans, optimize for Google\n\nKeyword research, content briefs, on-page SEO, and link-building strategies.' },
            { title: 'Newsletter Growth Strategies', slug: 'newsletter-growth', durationMinutes: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Email is still the highest-ROI channel\n\nGrowth loops, referral programs, cross-promotions, and monetization strategies.' },
            { title: 'Writing for Social Media', slug: 'social-writing', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Threads, hooks, and formats that work\n\nTwitter/X, LinkedIn, and Instagram — platform-specific writing strategies.' },
          ],
        },
        {
          title: 'Multimedia Content',
          lessons: [
            { title: 'Podcasting for Founders', slug: 'podcasting', durationMinutes: 24, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Your voice is your brand\n\nEquipment, editing, distribution, and how to book great guests — all on a bootstrap budget.' },
            { title: 'Video Content That Converts', slug: 'video-content', durationMinutes: 26, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## YouTube is the second largest search engine\n\nTalking-head videos, tutorials, shorts, and live streams — which formats work for B2B startups.' },
            { title: 'Repurposing & Distribution', slug: 'content-repurposing', durationMinutes: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: '## Create once, publish everywhere\n\nHow to turn one blog post into 20+ pieces of content across every platform.' },
          ],
        },
      ],
    },
  ];

  for (const courseData of courses) {
    const { modules, ...courseFields } = courseData;
    
    // Skip if course already exists (idempotent seed)
    const existing = await prisma.course.findUnique({ where: { slug: courseFields.slug } });
    if (existing) {
      // Update scalar fields (e.g. accessLevel) without touching modules
      await prisma.course.update({
        where: { slug: courseFields.slug },
        data: { ...courseFields },
      });
      console.log(`  📚 Updated course: ${courseFields.title}`);
      continue;
    }

    const course = await prisma.course.create({
      data: {
        ...courseFields,
        status: 'PUBLISHED',
        modules: {
          create: modules.map((mod, mi) => ({
            title: mod.title,
            sortOrder: mi,
            lessons: {
              create: mod.lessons.map((lesson, li) => ({
                ...lesson,
                sortOrder: li,
              })),
            },
          })),
        },
      },
    });
    console.log(`  📚 Created course: ${course.title}`);
  }

  console.log('✅ Courses created');

  // ==================== BADGES ====================
  const badges = [
    { name: 'First Step', description: 'Complete your first lesson', icon: '👣', category: 'LEARNING' as const, requirement: 1 },
    { name: 'Pathfinder', description: 'Complete your first learning path', icon: '🗺️', category: 'LEARNING' as const, requirement: 1 },
    { name: 'Quick Learner', description: 'Complete 5 lessons', icon: '📚', category: 'LEARNING' as const, requirement: 5 },
    { name: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '🧠', category: 'LEARNING' as const, requirement: 10 },
    { name: 'Scholar', description: 'Complete 25 lessons', icon: '🎓', category: 'LEARNING' as const, requirement: 25 },
    { name: 'Warming Up', description: '3-day learning streak', icon: '🔥', category: 'STREAK' as const, requirement: 3 },
    { name: 'On Fire', description: '7-day learning streak', icon: '🔥', category: 'STREAK' as const, requirement: 7 },
    { name: 'Unstoppable', description: '14-day learning streak', icon: '🌋', category: 'STREAK' as const, requirement: 14 },
    { name: 'Legendary', description: '30-day learning streak', icon: '👑', category: 'STREAK' as const, requirement: 30 },
    { name: 'First Words', description: 'Post in the community', icon: '💬', category: 'SOCIAL' as const, requirement: 1 },
    { name: 'Conversationalist', description: 'Make 10 community posts', icon: '🗣️', category: 'SOCIAL' as const, requirement: 10 },
    { name: 'Cheerleader', description: 'Cheer a lesson for the first time', icon: '👏', category: 'SOCIAL' as const, requirement: 1 },
    { name: 'Social Butterfly', description: '50 community interactions', icon: '🦋', category: 'SOCIAL' as const, requirement: 50 },
    { name: 'Centurion', description: 'Earn 100 XP', icon: '⚡', category: 'MILESTONE' as const, requirement: 100 },
    { name: 'Power User', description: 'Earn 500 XP', icon: '💪', category: 'MILESTONE' as const, requirement: 500 },
    { name: 'Grandmaster', description: 'Earn 1,000 XP', icon: '🏆', category: 'MILESTONE' as const, requirement: 1000 },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }
  console.log('✅ Badges created');

  // ==================== SAMPLE ENROLLMENT ====================
  const fundraisingCourse = await prisma.course.findUnique({ where: { slug: 'fundraising-101' } });
  if (fundraisingCourse) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: demoStudent.id, courseId: fundraisingCourse.id } },
      update: {},
      create: {
        userId: demoStudent.id,
        courseId: fundraisingCourse.id,
        progressPct: 30,
      },
    });

    // Mark some lessons as complete for the demo student
    const lessons = await prisma.lesson.findMany({
      where: { module: { courseId: fundraisingCourse.id } },
      take: 2,
      orderBy: { sortOrder: 'asc' },
    });

    for (const lesson of lessons) {
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId: demoStudent.id, lessonId: lesson.id } },
        update: {},
        create: {
          userId: demoStudent.id,
          lessonId: lesson.id,
          completed: true,
          completedAt: new Date(),
        },
      });
    }
    console.log('✅ Demo enrollment & progress created');
  }

  // ==================== SAMPLE QUIZ ====================
  const quizLesson = await prisma.lesson.findFirst({
    where: { slug: 'term-sheets' },
  });

  if (quizLesson) {
    const quiz = await prisma.quiz.upsert({
      where: { lessonId: quizLesson.id },
      update: {},
      create: {
        lessonId: quizLesson.id,
        passingScore: 70,
        timeLimitMinutes: 15,
        randomizeOrder: true,
        questions: {
          create: [
            {
              questionText: 'What does a liquidation preference determine?',
              questionType: 'MULTIPLE_CHOICE',
              sortOrder: 0,
              explanation: 'Liquidation preference determines who gets paid first and how much when the company is sold or liquidated.',
              answers: {
                create: [
                  { answerText: 'Who gets paid first in a sale', isCorrect: true, sortOrder: 0 },
                  { answerText: 'The company valuation', isCorrect: false, sortOrder: 1 },
                  { answerText: 'How many board seats investors get', isCorrect: false, sortOrder: 2 },
                  { answerText: 'The interest rate on convertible notes', isCorrect: false, sortOrder: 3 },
                ],
              },
            },
            {
              questionText: 'Anti-dilution provisions protect investors from future down rounds.',
              questionType: 'TRUE_FALSE',
              sortOrder: 1,
              explanation: 'Anti-dilution provisions adjust the conversion price of preferred stock if the company raises money at a lower valuation.',
              answers: {
                create: [
                  { answerText: 'True', isCorrect: true, sortOrder: 0 },
                  { answerText: 'False', isCorrect: false, sortOrder: 1 },
                ],
              },
            },
            {
              questionText: 'What is the standard board seat structure for a Series A startup?',
              questionType: 'MULTIPLE_CHOICE',
              sortOrder: 2,
              explanation: 'A typical Series A board has 5 seats: 2 founders, 2 investors, 1 independent director.',
              answers: {
                create: [
                  { answerText: '2 founders, 2 investors, 1 independent', isCorrect: true, sortOrder: 0 },
                  { answerText: '3 founders, 1 investor, 1 independent', isCorrect: false, sortOrder: 1 },
                  { answerText: 'All investors', isCorrect: false, sortOrder: 2 },
                ],
              },
            },
          ],
        },
      },
    });
    console.log('✅ Sample quiz created');
  }

  // ==================== SAMPLE LIVE CLASS ====================
  await prisma.liveClass.create({
    data: {
      title: 'Fundraising Q&A Office Hours',
      description: 'Bring your pitch deck and fundraising questions. Marcus will provide live feedback.',
      instructorId: marcus.id,
      courseId: fundraisingCourse?.id,
      platform: 'JITSI',
      roomName: 'hustle-fundraising-oh',
      startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
      maxAttendees: 50,
    },
  });
  console.log('✅ Sample live class created');

  // ==================== DRIP FEED & PREREQUISITES ====================
  if (fundraisingCourse) {
    // Upsert drip settings for fundraising course: release 1 lesson every 3 days
    await prisma.courseDripSettings.upsert({
      where: { courseId: fundraisingCourse.id },
      update: { enabled: true, type: 'INTERVAL_DAYS', intervalDays: 3 },
      create: {
        courseId: fundraisingCourse.id,
        enabled: true,
        type: 'INTERVAL_DAYS',
        intervalDays: 3,
      },
    });
    console.log('  ⏳ Drip settings: Fundraising 101 (every 3 days)');
  }

  const leadershipCourse = await prisma.course.findUnique({ where: { slug: 'leadership-foundations' } });
  if (leadershipCourse) {
    // Add prerequisite: "Defining Your Startup Culture" requires "From Builder to Leader" first
    const fromBuilder = await prisma.lesson.findFirst({
      where: { module: { courseId: leadershipCourse.id }, slug: 'from-builder-to-leader' },
    });
    const definingCulture = await prisma.lesson.findFirst({
      where: { module: { courseId: leadershipCourse.id }, slug: 'defining-your-culture' },
    });
    if (fromBuilder && definingCulture) {
      await prisma.lessonPrerequisite.upsert({
        where: { lessonId_prerequisiteLessonId: { lessonId: definingCulture.id, prerequisiteLessonId: fromBuilder.id } },
        update: {},
        create: { lessonId: definingCulture.id, prerequisiteLessonId: fromBuilder.id },
      });
      console.log('  🔗 Prerequisite: "Defining Culture" → "From Builder to Leader"');
    }
  }

  if (fundraisingCourse) {
    // Add prerequisite: "Crafting Your Story" requires "Intro to Fundraising" first
    const introFr = await prisma.lesson.findFirst({
      where: { module: { courseId: fundraisingCourse.id }, slug: 'intro-to-fundraising' },
    });
    const craftingStory = await prisma.lesson.findFirst({
      where: { module: { courseId: fundraisingCourse.id }, slug: 'crafting-your-story' },
    });
    if (introFr && craftingStory) {
      await prisma.lessonPrerequisite.upsert({
        where: { lessonId_prerequisiteLessonId: { lessonId: craftingStory.id, prerequisiteLessonId: introFr.id } },
        update: {},
        create: { lessonId: craftingStory.id, prerequisiteLessonId: introFr.id },
      });
      console.log('  🔗 Prerequisite: "Crafting Your Story" → "Intro to Fundraising"');
    }
  }

  console.log('✅ Drip feed & prerequisites seeded');

  // ==================== STUDY GROUPS ====================
  console.log('\n📚 Creating study groups for all courses...');

  const allCourseSlugs = [
    'fundraising-101',
    'growth-marketing',
    'product-led-growth',
    'leadership-foundations',
    'sales-for-founders',
    'startup-finance-101',
    'ai-tools-for-founders',
    'design-thinking',
    'remote-leadership',
    'content-marketing-mastery',
  ];

  const studyGroupPosts: Record<string, { authorId: string; content: string; replies: { authorId: string; content: string }[] }[]> = {
    'fundraising-101': [
      {
        authorId: marcus.id,
        content: "Welcome to the Fundraising 101 study group! 👋 I'm Marcus, your instructor. Drop your pitch deck questions here and I'll give live feedback. What's the #1 thing you're struggling with in your fundraise?",
        replies: [
          { authorId: demoStudent.id, content: "Thanks Marcus! I'm struggling with valuation — how do you determine a fair pre-money valuation for a pre-revenue startup?" },
          { authorId: marcus.id, content: "Great question Alex! For pre-revenue, it's mostly about comparable deals and team strength. Look at recent rounds in your sector at your stage. If you have strong founder-market fit and a big TAM, you can command a premium. I'd target $6-10M for a strong pre-seed." },
        ],
      },
      {
        authorId: demoStudent.id,
        content: "Just finished the 'Building the 12-Slide Deck' lesson. The framework is super clear. Anyone want to do a mutual pitch deck review? I'll go first — here's my problem slide.",
        replies: [
          { authorId: priya.id, content: "I love this idea! Peer review is one of the most underrated fundraising tactics. Happy to give feedback when you share." },
        ],
      },
      {
        authorId: devon.id,
        content: "For those asking about warm intros — I swear by the double opt-in method. Always ask your connector 'Would you be comfortable introducing me to X?' before sending the blurb. It respects their relationship and dramatically increases the yes rate.",
        replies: [],
      },
    ],
    'growth-marketing': [
      {
        authorId: priya.id,
        content: "Hey growth hackers! 👋 I'm Priya, your instructor for Growth Marketing. Let's kick things off: what's your current MRR and what channel is working best for you right now?",
        replies: [
          { authorId: demoStudent.id, content: "We're at $2K MRR, mostly from direct outreach. Looking to add a content engine to get more inbound. Any tips on where to start?" },
          { authorId: priya.id, content: "Start with one long-form pillar post per week targeting your highest-intent keyword. Repurpose it into 5-7 social posts. Consistency beats perfection — it took me 4 months to see real SEO traction." },
        ],
      },
    ],
    'product-led-growth': [
      {
        authorId: devon.id,
        content: "Welcome to PLG! The biggest mistake I see founders make is trying to bolt on PLG to a sales-led motion. You have to commit fully. What's your product's 'aha moment' — the thing that makes users go 'I get it now'?",
        replies: [
          { authorId: sarah.id, content: "So true. At my last company, we found our aha moment wasn't even a feature — it was when users saw their team's activity dashboard for the first time. That was our activation metric." },
        ],
      },
    ],
    'leadership-foundations': [
      {
        authorId: sarah.id,
        content: "Leadership is the hardest transition in a founder's journey. Going from doing everything to enabling others is uncomfortable but necessary. What's been your biggest leadership challenge so far?",
        replies: [
          { authorId: demoStudent.id, content: "Delegation. I still catch myself doing things my team could handle because 'it's faster if I just do it.' How do you break that habit?" },
          { authorId: sarah.id, content: "Set a rule: if someone on your team can do it 70% as well as you, delegate it. Your job is to make that 70% become 90% through coaching. Track your calendar — if you're spending more than 4 hours/day on IC work, you're not leading." },
        ],
      },
    ],
    'sales-for-founders': [
      {
        authorId: marcus.id,
        content: "Founders who sell have an unfair advantage — you can change the product roadmap mid-conversation based on what you hear. No salesperson can do that. What's your biggest fear about doing sales calls?",
        replies: [
          { authorId: priya.id, content: "Honestly, the fear of sounding salesy. I don't want to be that pushy person. How do you sell without feeling like you're selling?" },
          { authorId: marcus.id, content: "Reframe it: you're not selling, you're diagnosing. Ask questions, listen, and only pitch if your product actually solves their problem. The best 'sales calls' feel like consulting sessions." },
        ],
      },
    ],
    'startup-finance-101': [
      {
        authorId: devon.id,
        content: "Finance fluency is a superpower. When you can walk into a board meeting and talk cap tables, burn multiples, and unit economics, investors take you seriously. What finance topic scares you most?",
        replies: [
          { authorId: demoStudent.id, content: "Cap tables. I get the basics but once you add convertible notes, SAFEs, and option pools I'm lost. Is there a good template?" },
          { authorId: devon.id, content: "Check out the cap table lesson in Module 3 — I included a Google Sheet template. The key is to model dilution at each round. Most founders are shocked to see they'll own 15-20% after Series B." },
        ],
      },
    ],
    'ai-tools-for-founders': [
      {
        authorId: devon.id,
        content: "AI is moving so fast — this course is my attempt to cut through the noise and give you the 20% of tools that create 80% of the value. What AI tool has made the biggest impact on your workflow so far?",
        replies: [
          { authorId: priya.id, content: "Claude for writing first drafts of blog posts and email sequences. I still edit heavily but it cuts my writing time by 60%. Also Perplexity for market research — it's like having a research analyst." },
          { authorId: demoStudent.id, content: "Cursor for coding! I'm not technical but I built a landing page in 2 hours. Mind-blowing." },
        ],
      },
    ],
    'design-thinking': [
      {
        authorId: priya.id,
        content: "Design thinking isn't about making things pretty — it's about making things that work for real humans. Who's tried talking to users this week? What surprised you?",
        replies: [
          { authorId: sarah.id, content: "I interviewed 5 users yesterday and every single one used our product differently than we intended. We were optimizing for the wrong workflow entirely." },
        ],
      },
    ],
    'remote-leadership': [
      {
        authorId: sarah.id,
        content: "Remote leadership done right can be more effective than in-office. But done wrong, it's a retention disaster. What's your remote team setup — fully remote, hybrid, or async-first?",
        replies: [
          { authorId: devon.id, content: "Async-first with quarterly offsites. Writing culture is everything — if it's not documented, it didn't happen. We use Notion for all decision-making and Loom for walkthroughs." },
        ],
      },
    ],
    'content-marketing-mastery': [
      {
        authorId: priya.id,
        content: "Content marketing is the most underrated growth lever for bootstrapped startups. It compounds. The blog post you write today will bring traffic for years. What's your content strategy right now?",
        replies: [
          { authorId: demoStudent.id, content: "Honestly, we don't have one. We post randomly on Twitter when we remember. Where should we start?" },
          { authorId: priya.id, content: "Pick ONE platform and ONE format. Master it before expanding. For B2B SaaS, I'd start with LinkedIn + a weekly newsletter. Block 2 hours every Monday morning to write. Ship even when it's not perfect." },
        ],
      },
    ],
  };

  for (const courseSlug of allCourseSlugs) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true, instructorId: true },
    });
    if (!course) {
      console.log(`  ⚠️  Course not found: ${courseSlug}, skipping study group`);
      continue;
    }

    // Create or get study group
    let group = await prisma.courseStudyGroup.findUnique({
      where: { courseId: course.id },
    });

    if (!group) {
      group = await prisma.courseStudyGroup.create({
        data: {
          courseId: course.id,
          description: `Study group for ${courseSlug}`,
        },
      });
      console.log(`  📚 Created study group: ${courseSlug}`);
    } else {
      console.log(`  📚 Study group exists: ${courseSlug}`);
    }

    // Add members: instructor + demo student + 1-2 other instructors
    const memberIds = new Set<string>();
    if (course.instructorId) memberIds.add(course.instructorId);
    memberIds.add(demoStudent.id);
    // Mix in other instructors for cross-pollination
    for (const inst of instructors) {
      if (memberIds.size >= 5) break;
      memberIds.add(inst.id);
    }

    for (const userId of memberIds) {
      await prisma.courseGroupMember.upsert({
        where: { groupId_userId: { groupId: group.id, userId } },
        update: {},
        create: { groupId: group.id, userId },
      });
    }
    console.log(`  👥 Added ${memberIds.size} members`);

    // Add pre-seeded posts with replies if they don't exist yet
    const existingPosts = await prisma.courseGroupPost.count({ where: { groupId: group.id } });
    if (existingPosts === 0) {
      const posts = studyGroupPosts[courseSlug] || [];
      for (const postData of posts) {
        const post = await prisma.courseGroupPost.create({
          data: {
            groupId: group.id,
            authorId: postData.authorId,
            content: postData.content,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)), // random date in last 14 days
          },
        });
        for (const replyData of postData.replies) {
          await prisma.courseGroupReply.create({
            data: {
              postId: post.id,
              authorId: replyData.authorId,
              content: replyData.content,
              createdAt: new Date(post.createdAt.getTime() + Math.floor(Math.random() * 4 + 1) * 60 * 60 * 1000), // 1-4 hours after post
            },
          });
        }
      }
      console.log(`  💬 Added ${posts.length} posts with replies`);
    } else {
      console.log(`  💬 ${existingPosts} posts already exist, skipping`);
    }
  }

  console.log('✅ Study groups seeded');

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
