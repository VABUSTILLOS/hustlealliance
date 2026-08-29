// prisma/seed-challenges.ts — Community challenges for the /challenges section
// (Selling, Branding, Content, Cold Outreach)
//
// Usage: npx tsx prisma/seed-challenges.ts
// Prerequisites: Main seed (prisma/seed.ts) must be run first (admin user)
// Idempotent: upserts throughout, safe to re-run.

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

const DAY = 86_400_000;

const adapter = new PrismaPg({
  connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
});
const prisma = new PrismaClient({ adapter });

type SeedTask = [dayNumber: number, title: string, description: string];
type SeedChallenge = {
  slug: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'UPCOMING';
  // startDate is computed from now: negative offset = started in the past
  startOffsetDays: number;
  durationDays: number;
  tasks: SeedTask[];
};

const challenges: SeedChallenge[] = [
  {
    slug: '7-day-first-sale-sprint',
    title: '7-Day First Sale Sprint',
    description:
      'Get your first (or next) customer in 7 days. Daily selling tasks, public accountability, and a community celebrating wins with you. Free for all members.',
    status: 'ACTIVE',
    startOffsetDays: -3,
    durationDays: 7,
    tasks: [
      [1, 'Define your offer', 'Write a one-sentence offer: who you serve, what you help them get, and the one result they walk away with.'],
      [2, 'List 20 prospects', 'Real names or real profiles of people who need exactly what you sell. Aim for warm leads first.'],
      [3, 'Craft your outreach script', 'A short, human message: compliment or reference, the problem you solve, and a single low-friction next step.'],
      [4, 'Send 10 messages', 'Personalize each one. Do not copy-paste the same message twice.'],
      [5, 'Follow up with everyone', 'Send a gentle follow-up to non-responders. Persistence is part of the sale.'],
      [6, 'Handle 3 objections', 'Write your best reply to the top 3 objections you get. Keep them honest and helpful, not pushy.'],
      [7, 'Close & post the win 🎉', 'Ask for the yes. Whatever happened — close a deal or land a next step — share your result in the community.'],
    ],
  },
  {
    slug: '14-day-branding-bootcamp',
    title: '14-Day Branding Bootcamp',
    description:
      'Build a brand you are proud to show the world in 14 days. Positioning, voice, visuals, and a launch-ready brand kit — all free.',
    status: 'ACTIVE',
    startOffsetDays: -2,
    durationDays: 14,
    tasks: [
      [1, 'Write your positioning statement', 'For [audience], who [need], [brand] is the [category] that [key benefit], unlike [alternative].'],
      [2, 'Build your audience persona', 'One page on who you serve: goals, pains, where they hang out, and the words they use.'],
      [3, 'Define your brand voice', 'Pick 3 adjectives describing how you sound, then write 2 sample posts in that voice.'],
      [4, 'Audit your name & tagline', 'Does your name still fit? Does your tagline say what you do in under 8 words? Fix if not.'],
      [5, 'Choose colors & typography', 'Pick a 2–3 color palette and 2 fonts. Note the hex codes and why they fit your personality.'],
      [6, 'Create your logo or wordmark', 'Simple, readable at small sizes, works in one color. Tools like Canva or Figma are fine.'],
      [7, 'Rewrite your social bios', 'Consistent name, headline, and bio across all profiles using your new voice and positioning.'],
      [8, 'Rewrite your about page', 'Tell your story: who you help, why you started, and what makes you different.'],
      [9, 'Define your content pillars', 'The 3–5 topics you will always talk about. Each pillar should tie back to your positioning.'],
      [10, 'Create your content templates', 'One visual template and one post template you can reuse everywhere.'],
      [11, 'Write your brand guidelines one-pager', 'Logo usage, colors, fonts, voice, and 2 do / 2 do-not examples.'],
      [12, 'Run a launch checklist', 'Are all profiles consistent? Logo on all assets? Tagline everywhere? Fix gaps.'],
      [13, 'Do a 30-minute brand audit', 'Visit your site and socials like a stranger. Note 5 things you would improve.'],
      [14, 'Reveal & share your brand 🎉', 'Post your new brand kit in the community. Celebrate how far you have come.'],
    ],
  },
  {
    slug: '21-day-content-engine',
    title: '21-Day Content Engine',
    description:
      'Stop posting randomly and start building a repeatable content engine. 21 days of planning, publishing, and improving — free for all members.',
    status: 'UPCOMING',
    startOffsetDays: 3,
    durationDays: 21,
    tasks: [
      [1, 'Define your content goals', 'One sentence: what should content do for you — trust, traffic, leads, community?'],
      [2, 'Pick your channels', 'Choose 1–2 platforms max. Depth beats breadth.'],
      [3, 'Write your content pillars', 'The 3–5 recurring topics you will own. Every post maps to a pillar.'],
      [4, 'Build a 7-day content calendar', 'Schedule posts, topics, and formats for the next week.'],
      [5, 'Batch-write 3 posts', 'Write 3 posts in one sitting using your pillars. Done is better than perfect.'],
      [6, 'Publish post #1', 'Post your first piece of the week. Add one strong hook line.'],
      [7, 'Week 1 retro + share progress', 'What worked, what flopped? Share your numbers and learnings in the community.'],
      [8, 'Repurpose a post', 'Turn one past post into a different format: thread, carousel, or short video.'],
      [9, 'Create one visual', 'A simple graphic or template that makes your posts instantly recognizable.'],
      [10, 'Publish post #2', 'Ship your second post. Test a new hook style today.'],
      [11, 'Engage with 10 people', 'Leave thoughtful comments on others in your niche. Build the habit of showing up.'],
      [12, 'Write a hook bank', 'Collect 10 scroll-stopping opening lines you can reuse.'],
      [13, 'Publish post #3', 'Ship your third post of the week.'],
      [14, 'Week 2 retro + share progress', 'Review the numbers again. What content got the most reaction?'],
      [15, 'Create a short-form video', 'Under 60 seconds, one idea. Speak it, don\u2019t script it.'],
      [16, 'Publish post #4', 'Ship your fourth post.'],
      [17, 'Draft your newsletter', 'Round up your best content of the month in 5 bullet points.'],
      [18, 'Publish post #5', 'Ship your fifth post.'],
      [19, 'Analyze your top post', 'Pick your best-performing post. What made it work? Write it down.'],
      [20, 'Publish post #6', 'Ship your sixth post and finish the month strong.'],
      [21, 'Week 3 retro + plan next month 🎉', 'Share your full-month results and your plan for the next month in the community.'],
    ],
  },
  {
    slug: '5-day-cold-outreach',
    title: '5-Day Cold Outreach Challenge',
    description:
      'Master cold outreach in 5 days: define your ideal customer, build a list, and send a wave of personalized first touches that book meetings.',
    status: 'UPCOMING',
    startOffsetDays: 7,
    durationDays: 5,
    tasks: [
      [1, 'Define your ideal customer profile', 'Industry, role, company size, and the specific pain you solve. Be narrow — you can widen later.'],
      [2, 'Build a list of 50 leads', 'Find 50 real people who match your ICP. Include their name, company, and one personal detail.'],
      [3, 'Write your first-touch scripts', 'A 3-sentence opener: relevant compliment, the problem, and a one-question ask. Personalize the template.'],
      [4, 'Send 20 first-touches', 'Send your first 20 messages, personalized. Set up a follow-up sequence for non-responders.'],
      [5, 'Review responses & book meetings 🎉', 'Reply fast, answer questions, and book at least 1 call. Share your reply rate in the community.'],
    ],
  },
];

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    throw new Error('No ADMIN user found — run prisma/seed.ts first');
  }

  for (const c of challenges) {
    const startDate = new Date(Date.now() + c.startOffsetDays * DAY);
    const endDate = new Date(startDate.getTime() + c.durationDays * DAY);

    const challenge = await prisma.challenge.upsert({
      where: { slug: c.slug },
      create: {
        title: c.title,
        slug: c.slug,
        description: c.description,
        status: c.status,
        startDate,
        endDate,
        price: 0,
        creatorId: admin.id,
      },
      update: { title: c.title, description: c.description, status: c.status, startDate, endDate },
    });

    for (const [dayNumber, title, description] of c.tasks) {
      await prisma.challengeTask.upsert({
        where: { challengeId_dayNumber: { challengeId: challenge.id, dayNumber } },
        create: { challengeId: challenge.id, dayNumber, title, description, sortOrder: dayNumber },
        update: { title, description, sortOrder: dayNumber },
      });
    }

    console.log(`✓ "${challenge.title}" (${c.status}) with ${c.tasks.length} tasks`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
