import "server-only";
import prisma from "@/lib/db/prisma";
import { OnboardingQuestionType } from "@/lib/generated/prisma/client";
import type { AuthUser } from "@/lib/auth/user";

const WELCOME_SETTING_KEY = "onboarding.welcome";

type WelcomeSettings = {
  title: string;
  message: string;
  sendEmail: boolean;
};

const DEFAULT_WELCOME: WelcomeSettings = {
  title: "Welcome to Hustle Alliance!",
  message:
    "We're so glad you're here. Explore the community, join a group, and start connecting with other members.",
  sendEmail: false,
};

// ── Member-facing ────────────────────────────────────────────────────────

/**
 * Mock/test auth users (see lib/auth/mock.ts, lib/auth/test-user.ts) have no
 * row in the User table, which makes every onboarding write fail (FK violation
 * on answers, "record not found" on complete). Ensure a real row exists and
 * return it, so callers can use its actual id.
 */
export async function ensureDbUser(user: AuthUser) {
  const byId = await prisma.user.findUnique({ where: { id: user.id } });
  if (byId) return byId;

  const byEmail = await prisma.user.findUnique({ where: { email: user.email } });
  if (byEmail) return byEmail;

  try {
    return await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        membershipTier: user.membershipTier,
        avatar: user.avatar,
      },
    });
  } catch {
    // Lost a race with a concurrent create — re-read.
    const created =
      (await prisma.user.findUnique({ where: { id: user.id } })) ??
      (await prisma.user.findUnique({ where: { email: user.email } }));
    if (created) return created;
    throw new Error("Failed to ensure user record");
  }
}

export async function getActiveQuestions() {
  return prisma.onboardingQuestion.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAnswersForUser(userId: string) {
  return prisma.onboardingAnswer.findMany({
    where: { userId },
  });
}

export async function saveAnswers(
  userId: string,
  answers: { questionId: string; answer: string | string[] }[],
) {
  await Promise.all(
    answers.map(({ questionId, answer }) => {
      const value = Array.isArray(answer) ? JSON.stringify(answer) : answer;
      return prisma.onboardingAnswer.upsert({
        where: { questionId_userId: { questionId, userId } },
        update: { answer: value },
        create: { questionId, userId, answer: value },
      });
    }),
  );
}

export async function completeOnboarding(userId: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { onboardedAt: new Date() },
  });

  const welcome = await getWelcomeSettings();

  await prisma.notification.create({
    data: {
      userId,
      type: "WELCOME",
      title: welcome.title,
      body: welcome.message,
    },
  });

  if (welcome.sendEmail) {
    // Reuse the existing SIGNUP automation pipeline (see app/api/cron/automations/route.ts)
    // rather than building a new email-send path. If no active SIGNUP automation exists,
    // skip silently.
    const automation = await prisma.emailAutomation.findFirst({
      where: { trigger: "SIGNUP", isActive: true },
    });
    if (automation) {
      const existingRun = await prisma.automationRun.findFirst({
        where: { automationId: automation.id, userId },
      });
      if (!existingRun) {
        const runAt = new Date(Date.now() + automation.delayMinutes * 60 * 1000);
        await prisma.automationRun.create({
          data: { automationId: automation.id, userId, runAt },
        });
      }
    }
  }

  return user;
}

export async function isOnboardingComplete(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardedAt: true },
  });
  return user?.onboardedAt != null;
}

export async function getChecklistState(userId: string) {
  const [user, profile, groupMembership, follow, enrollment, post] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { avatar: true, bio: true, onboardedAt: true } }),
    prisma.profile.findUnique({ where: { userId }, select: { summary: true, headline: true } }),
    prisma.communityGroupMember.findFirst({ where: { userId }, select: { id: true } }),
    prisma.follow.findFirst({ where: { followerId: userId }, select: { id: true } }),
    prisma.enrollment.findFirst({ where: { userId }, select: { id: true } }),
    prisma.communityPost.findFirst({ where: { authorId: userId, isDeleted: false }, select: { id: true } }),
  ]);

  const profileCompleted = Boolean(
    user?.avatar && (user?.bio || profile?.summary || profile?.headline),
  );

  const items = [
    { key: "profileCompleted", label: "Complete your profile", done: profileCompleted },
    { key: "onboardingDone", label: "Finish onboarding", done: user?.onboardedAt != null },
    { key: "joinedGroup", label: "Join a group", done: Boolean(groupMembership) },
    { key: "followedMember", label: "Follow a member", done: Boolean(follow) },
    { key: "enrolledCourse", label: "Enroll in a course", done: Boolean(enrollment) },
    { key: "firstPost", label: "Make your first post", done: Boolean(post) },
  ];

  return { items };
}

// ── Admin ────────────────────────────────────────────────────────────────

export async function adminListQuestions() {
  const questions = await prisma.onboardingQuestion.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { answers: true } } },
  });
  return questions.map((q) => ({
    id: q.id,
    question: q.question,
    type: q.type,
    options: q.options,
    sortOrder: q.sortOrder,
    isActive: q.isActive,
    answerCount: q._count.answers,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
  }));
}

export async function createQuestion(data: {
  question: string;
  type?: OnboardingQuestionType;
  options?: string[];
  sortOrder?: number;
  isActive?: boolean;
}) {
  const maxSort = await prisma.onboardingQuestion.aggregate({
    _max: { sortOrder: true },
  });
  return prisma.onboardingQuestion.create({
    data: {
      question: data.question,
      type: data.type ?? "TEXT",
      options: data.options ?? [],
      sortOrder: data.sortOrder ?? (maxSort._max.sortOrder ?? 0) + 1,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateQuestion(
  id: string,
  data: Partial<{
    question: string;
    type: OnboardingQuestionType;
    options: string[];
    sortOrder: number;
    isActive: boolean;
  }>,
) {
  return prisma.onboardingQuestion.update({ where: { id }, data });
}

export async function deleteQuestion(id: string) {
  return prisma.onboardingQuestion.delete({ where: { id } });
}

export async function reorderQuestions(orderedIds: string[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.onboardingQuestion.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
}

export async function getWelcomeSettings(): Promise<WelcomeSettings> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: WELCOME_SETTING_KEY } });
  if (!setting) return DEFAULT_WELCOME;
  const value = setting.value as Partial<WelcomeSettings>;
  return {
    title: value.title ?? DEFAULT_WELCOME.title,
    message: value.message ?? DEFAULT_WELCOME.message,
    sendEmail: value.sendEmail ?? DEFAULT_WELCOME.sendEmail,
  };
}

export async function setWelcomeSettings(settings: WelcomeSettings) {
  return prisma.siteSetting.upsert({
    where: { key: WELCOME_SETTING_KEY },
    update: { value: settings },
    create: { key: WELCOME_SETTING_KEY, value: settings },
  });
}

export async function getOnboardingResponses() {
  const questions = await prisma.onboardingQuestion.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      answers: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      _count: { select: { answers: true } },
    },
  });

  return questions.map((q) => {
    const counts: Record<string, number> = {};
    if (q.type !== "TEXT") {
      for (const a of q.answers) {
        let values: string[];
        try {
          const parsed = JSON.parse(a.answer);
          values = Array.isArray(parsed) ? parsed : [a.answer];
        } catch {
          values = [a.answer];
        }
        for (const v of values) {
          counts[v] = (counts[v] ?? 0) + 1;
        }
      }
    }
    return {
      id: q.id,
      question: q.question,
      type: q.type,
      options: q.options,
      totalAnswers: q._count.answers,
      counts,
      recentAnswers: q.answers.map((a) => ({
        id: a.id,
        answer: a.answer,
        createdAt: a.createdAt,
        user: a.user,
      })),
    };
  });
}
