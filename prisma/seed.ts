import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

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
  ]);

  const [catFundraising, catMarketing, catProduct, catLeadership] = categories;
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
      thumbnail: 'https://images.unsplash.com/photo-1553484771-371e845efba1?w=800&h=500&fit=crop',
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
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
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
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
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
      communitySpaceSlug: 'leader-circle',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop',
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
