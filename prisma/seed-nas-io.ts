// prisma/seed-nas-io.ts — Seed data for NAS.IO-inspired features
// (Challenges, Onboarding questions, welcome SiteSetting)
//
// Usage: npx tsx prisma/seed-nas-io.ts
// Prerequisites: Main seed (prisma/seed.ts) must be run first (admin user)
// Idempotent: upserts throughout

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    throw new Error('No ADMIN user found — run prisma/seed.ts first');
  }

  // ── Onboarding questions ──────────────────────────────────────────────────
  const questions = [
    {
      question: 'What best describes where you are right now?',
      type: 'SELECT' as const,
      options: ['Idea stage', 'Building an MVP', 'Launched, pre-revenue', 'Generating revenue', 'Scaling'],
      sortOrder: 0,
    },
    {
      question: 'What is your #1 goal for the next 90 days?',
      type: 'TEXT' as const,
      options: [],
      sortOrder: 1,
    },
    {
      question: 'Which topics do you want help with?',
      type: 'MULTI_SELECT' as const,
      options: ['Marketing', 'Sales', 'Product', 'Fundraising', 'Operations', 'Mindset'],
      sortOrder: 2,
    },
  ];

  for (const q of questions) {
    const existing = await prisma.onboardingQuestion.findFirst({
      where: { question: q.question },
    });
    if (existing) {
      await prisma.onboardingQuestion.update({
        where: { id: existing.id },
        data: { type: q.type, options: q.options, sortOrder: q.sortOrder, isActive: true },
      });
    } else {
      await prisma.onboardingQuestion.create({ data: q });
    }
  }
  console.log(`✓ ${questions.length} onboarding questions`);

  // ── Welcome message settings ──────────────────────────────────────────────
  await prisma.siteSetting.upsert({
    where: { key: 'onboarding.welcome' },
    create: {
      key: 'onboarding.welcome',
      value: {
        title: 'Welcome to Hustle Alliance! 🎉',
        message:
          'You\'re in. Start by completing your profile, joining a space, and enrolling in your first course. Never hustle alone.',
        sendEmail: false,
      },
    },
    update: {},
  });
  console.log('✓ welcome SiteSetting');

  // ── Sample challenge ──────────────────────────────────────────────────────
  const startDate = new Date(Date.now() + 3 * 86_400_000);
  const endDate = new Date(startDate.getTime() + 30 * 86_400_000);

  const challenge = await prisma.challenge.upsert({
    where: { slug: '30-day-launch-sprint' },
    create: {
      title: '30-Day Launch Sprint',
      slug: '30-day-launch-sprint',
      description:
        'Ship your MVP in 30 days. Daily tasks, public accountability, and a community of founders launching alongside you. Free for all members.',
      status: 'UPCOMING',
      startDate,
      endDate,
      price: 0,
      creatorId: admin.id,
    },
    update: { startDate, endDate, status: 'UPCOMING' },
  });

  const taskTitles: [number, string, string][] = [
    [1, 'Define your one-sentence pitch', 'Write a single sentence: who you help, what you help them do, and why it matters.'],
    [2, 'List 10 potential customers', 'Real names or real profiles. People you could talk to this week.'],
    [3, 'Do 1 customer interview', 'Ask about their current workflow and biggest pain — not about your idea.'],
    [4, 'Sketch your MVP scope', 'One page: the smallest thing that delivers the core value. Cut everything else.'],
    [5, 'Pick your stack and set up the repo', 'Boring tech you already know. Ship, don\'t shop.'],
    [6, 'Build the landing page', 'Headline, subheadline, email capture. Deploy it today.'],
    [7, 'Week 1 retro + share progress', 'Post your progress in the community. What shipped, what blocked you?'],
  ];
  // Fill remaining days with repeating build/share cadence
  for (let day = 8; day <= 30; day++) {
    if (day % 7 === 0) {
      taskTitles.push([day, `Week ${Math.floor(day / 7)} retro + share progress`, 'Post your progress in the community.']);
    } else if (day === 30) {
      taskTitles.push([day, 'LAUNCH DAY 🚀', 'Ship it. Post your launch in the community and everywhere else.']);
    } else {
      taskTitles.push([day, `Build day ${day}`, 'Work on the most important outstanding task. Log what you shipped.']);
    }
  }

  for (const [dayNumber, title, description] of taskTitles) {
    await prisma.challengeTask.upsert({
      where: { challengeId_dayNumber: { challengeId: challenge.id, dayNumber } },
      create: { challengeId: challenge.id, dayNumber, title, description, sortOrder: dayNumber },
      update: { title, description, sortOrder: dayNumber },
    });
  }
  console.log(`✓ sample challenge "${challenge.title}" with ${taskTitles.length} tasks`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
