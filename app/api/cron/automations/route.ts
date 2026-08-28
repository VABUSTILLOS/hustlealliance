import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { sendCampaignEmail, instrumentHtml } from '@/lib/email/campaign-send';

// GET /api/cron/automations
// Runs every few minutes (see vercel.json). For each active EmailAutomation:
//  1. Finds recently-occurred trigger events (signup / enrollment / purchase / drip-eligible
//     enrollment) that don't yet have an AutomationRun for this automation + user.
//  2. Creates a PENDING AutomationRun scheduled at event time + delayMinutes.
//  3. Sends (or demo-logs) any PENDING runs whose runAt has passed, marking them SENT/FAILED.
// LOOKBACK bounds how far back we scan for new trigger events so the cron job stays cheap.
const LOOKBACK_MS = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const since = new Date(now.getTime() - LOOKBACK_MS);
    const automations = await prisma.emailAutomation.findMany({ where: { isActive: true } });

    let runsCreated = 0;

    for (const automation of automations) {
      const existingRunUserIds = new Set(
        (
          await prisma.automationRun.findMany({
            where: { automationId: automation.id },
            select: { userId: true },
          })
        ).map((r) => r.userId),
      );

      // eventUserId -> eventAt
      let events: { userId: string; eventAt: Date }[] = [];

      if (automation.trigger === 'SIGNUP') {
        const users = await prisma.user.findMany({
          where: { createdAt: { gte: since } },
          select: { id: true, createdAt: true },
        });
        events = users.map((u) => ({ userId: u.id, eventAt: u.createdAt }));
      } else if (automation.trigger === 'ENROLLMENT' || automation.trigger === 'DRIP') {
        const enrollments = await prisma.enrollment.findMany({
          where: { enrolledAt: { gte: since } },
          select: { userId: true, enrolledAt: true },
        });
        events = enrollments.map((e) => ({ userId: e.userId, eventAt: e.enrolledAt }));
      } else if (automation.trigger === 'PURCHASE') {
        const orders = await prisma.storeOrder.findMany({
          where: { status: { in: ['PAID', 'FULFILLED'] }, paidAt: { gte: since } },
          select: { userId: true, paidAt: true },
        });
        events = orders
          .filter((o) => o.paidAt)
          .map((o) => ({ userId: o.userId, eventAt: o.paidAt as Date }));
      }

      const newEvents = events.filter((e) => !existingRunUserIds.has(e.userId));
      // Dedupe multiple events for the same user within this batch.
      const seen = new Set<string>();
      for (const event of newEvents) {
        if (seen.has(event.userId)) continue;
        seen.add(event.userId);
        const runAt = new Date(event.eventAt.getTime() + automation.delayMinutes * 60 * 1000);
        await prisma.automationRun.create({
          data: { automationId: automation.id, userId: event.userId, runAt },
        });
        runsCreated++;
      }
    }

    // Send any due, pending runs.
    const dueRuns = await prisma.automationRun.findMany({
      where: { status: 'PENDING', runAt: { lte: now } },
      include: {
        user: { select: { email: true, emailUnsubscribed: true } },
        automation: {
          select: { subject: true, html: true, steps: { orderBy: { order: 'asc' } } },
        },
      },
    });

    let sentCount = 0;
    let failedCount = 0;

    for (const run of dueRuns) {
      if (run.user.emailUnsubscribed) {
        await prisma.automationRun.update({ where: { id: run.id }, data: { status: 'FAILED' } });
        failedCount++;
        continue;
      }
      if (!run.user.email) {
        await prisma.automationRun.update({ where: { id: run.id }, data: { status: 'FAILED' } });
        failedCount++;
        continue;
      }

      // Multi-step automations send whichever step `currentStep` points at; automations
      // without steps fall back to the legacy single subject/html/delayMinutes fields.
      const steps = run.automation.steps;
      const step = steps.length > 0 ? steps[run.currentStep] : null;
      const subject = step?.subject ?? run.automation.subject;
      const stepHtml = step?.html ?? run.automation.html;

      try {
        const html = instrumentHtml(stepHtml, run.id, run.userId);
        const result = await sendCampaignEmail({ to: run.user.email, subject, html });
        if (!result) {
          await prisma.automationRun.update({ where: { id: run.id }, data: { status: 'FAILED' } });
          failedCount++;
          continue;
        }

        const nextStepIndex = run.currentStep + 1;
        const nextStep = steps[nextStepIndex];
        if (steps.length > 0 && nextStep) {
          // More steps remain: reschedule for the next step's delay and advance currentStep.
          await prisma.automationRun.update({
            where: { id: run.id },
            data: {
              currentStep: nextStepIndex,
              runAt: new Date(Date.now() + nextStep.delayMinutes * 60 * 1000),
              sentAt: new Date(),
            },
          });
        } else {
          await prisma.automationRun.update({
            where: { id: run.id },
            data: { status: 'SENT', sentAt: new Date() },
          });
        }
        sentCount++;
      } catch (err) {
        console.error(`[CRON /automations] Send failed for run ${run.id}:`, err);
        await prisma.automationRun.update({ where: { id: run.id }, data: { status: 'FAILED' } });
        failedCount++;
      }
    }

    return NextResponse.json({ success: true, runsCreated, sentCount, failedCount });
  } catch (error) {
    console.error('[CRON /automations] Error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
