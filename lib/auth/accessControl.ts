import prisma from '@/lib/db/prisma';
import { MembershipTier, ContentAccessLevel } from '@/lib/generated/prisma/client';

// ─── Types ───────────────────────────────────────────────────────

export type AccessCheckResult = {
  allowed: boolean;
  reason: 'tier_granted' | 'entitlement_granted' | 'preview_granted' | 'blocked';
  requiredTier: ContentAccessLevel;
  userTier: MembershipTier;
  hasEntitlement: boolean;
  upgradeOptions: UpgradeOption[];
};

export type UpgradeOption = {
  type: 'subscription' | 'purchase_course' | 'purchase_lesson';
  tier?: MembershipTier;
  courseId?: string;
  courseTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  price?: number | null;
};

// ─── Tier Hierarchy ──────────────────────────────────────────────

const TIER_ORDER: Record<MembershipTier, number> = {
  [MembershipTier.FREE]: 0,
  [MembershipTier.BASIC]: 1,
  [MembershipTier.PRO]: 2,
};

function tierGrantsAccess(userTier: MembershipTier, requiredLevel: ContentAccessLevel): boolean {
  const userLevel = TIER_ORDER[userTier] ?? 0;
  const required = TIER_ORDER[requiredLevel as unknown as MembershipTier] ?? 0;
  return userLevel >= required;
}

// ─── Effective Access Level ──────────────────────────────────────

async function getEffectiveAccessLevel(
  lessonId?: string,
  courseId?: string
): Promise<{
  level: ContentAccessLevel;
  coursePrice: number | null;
  courseTitle: string;
  courseId: string;
  lessonId?: string;
  lessonTitle?: string;
}> {
  if (lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        title: true,
        accessLevel: true,
        module: {
          select: {
            course: {
              select: { id: true, title: true, accessLevel: true, price: true },
            },
          },
        },
      },
    });
    if (!lesson) throw new Error('Lesson not found');

    const course = lesson.module.course;
    return {
      level: lesson.accessLevel ?? course.accessLevel,
      coursePrice: course.price,
      courseTitle: course.title,
      courseId: course.id,
      lessonId: lessonId,
      lessonTitle: lesson.title,
    };
  }

  if (courseId) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, accessLevel: true, price: true },
    });
    if (!course) throw new Error('Course not found');

    return {
      level: course.accessLevel,
      coursePrice: course.price,
      courseTitle: course.title,
      courseId: course.id,
    };
  }

  throw new Error('Either lessonId or courseId must be provided');
}

// ─── Entitlement Check ───────────────────────────────────────────

async function userHasEntitlement(
  userId: string,
  lessonId?: string,
  courseId?: string
): Promise<boolean> {
  if (lessonId) {
    const lessonEntitlement = await prisma.entitlement.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
    if (lessonEntitlement) return true;
  }

  if (courseId) {
    const courseEntitlement = await prisma.entitlement.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (courseEntitlement) return true;
  }

  return false;
}

// ─── Build Upgrade Options ───────────────────────────────────────

function buildUpgradeOptions(
  userTier: MembershipTier,
  effective: Awaited<ReturnType<typeof getEffectiveAccessLevel>>
): UpgradeOption[] {
  const options: UpgradeOption[] = [];

  // Subscription upgrade paths
  if (effective.level === ContentAccessLevel.PRO && userTier === MembershipTier.FREE) {
    options.push({ type: 'subscription', tier: MembershipTier.BASIC });
  }
  options.push({ type: 'subscription', tier: MembershipTier.PRO });

  // À la carte: course purchase
  if (effective.coursePrice != null) {
    options.push({
      type: 'purchase_course',
      courseId: effective.courseId,
      courseTitle: effective.courseTitle,
      price: effective.coursePrice,
    });
  }

  return options;
}

// ─── Main Access Check ───────────────────────────────────────────

export async function checkAccess(params: {
  userId: string;
  lessonId?: string;
  courseId?: string;
}): Promise<AccessCheckResult> {
  const { userId, lessonId, courseId } = params;

  // 1. Preview lessons are always free
  if (lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { isPreview: true },
    });
    if (lesson?.isPreview) {
      return {
        allowed: true,
        reason: 'preview_granted',
        requiredTier: ContentAccessLevel.FREE,
        userTier: MembershipTier.FREE,
        hasEntitlement: false,
        upgradeOptions: [],
      };
    }
  }

  // 2. Get user tier
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { membershipTier: true },
  });
  const userTier = user?.membershipTier ?? MembershipTier.FREE;

  // 3. Get effective access level
  const effective = await getEffectiveAccessLevel(lessonId, courseId);

  // 4. Tier check
  if (tierGrantsAccess(userTier, effective.level)) {
    return {
      allowed: true,
      reason: 'tier_granted',
      requiredTier: effective.level,
      userTier,
      hasEntitlement: false,
      upgradeOptions: [],
    };
  }

  // 5. Entitlement check (individual purchase)
  const hasEntitlement = await userHasEntitlement(userId, lessonId, courseId);
  if (hasEntitlement) {
    return {
      allowed: true,
      reason: 'entitlement_granted',
      requiredTier: effective.level,
      userTier,
      hasEntitlement: true,
      upgradeOptions: [],
    };
  }

  // 6. Blocked
  return {
    allowed: false,
    reason: 'blocked',
    requiredTier: effective.level,
    userTier,
    hasEntitlement: false,
    upgradeOptions: buildUpgradeOptions(userTier, effective),
  };
}

// ─── Dashboard Summary ───────────────────────────────────────────

export async function getUserAccessSummary(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { membershipTier: true, membershipExpiresAt: true },
  });

  const [entitlementCount, enrollmentCount] = await Promise.all([
    prisma.entitlement.count({ where: { userId } }),
    prisma.enrollment.count({ where: { userId } }),
  ]);

  return {
    tier: user?.membershipTier ?? MembershipTier.FREE,
    expiresAt: user?.membershipExpiresAt ?? null,
    entitlementCount,
    enrollmentCount,
    tierBenefits: getTierBenefits(user?.membershipTier ?? MembershipTier.FREE),
  };
}

function getTierBenefits(tier: MembershipTier): string[] {
  switch (tier) {
    case MembershipTier.PRO:
      return ['Unlimited access to all courses', 'All PRO content included', 'Priority support', 'Certificate downloads'];
    case MembershipTier.BASIC:
      return ['Access to BASIC & FREE courses', 'À la carte PRO purchases', 'Community access', 'Certificate downloads'];
    case MembershipTier.FREE:
    default:
      return ['Access to FREE courses', 'À la carte BASIC & PRO purchases', 'Community access'];
  }
}
