import type { Prisma, MembershipTier, UserRole } from '@/lib/generated/prisma/client';

/**
 * JSON segment filter format stored on `EmailCampaign.segmentFilter`.
 * All fields are optional; omitted fields impose no constraint.
 * Multiple fields are combined with AND semantics.
 */
export type SegmentFilter = {
  /** Only users on one of these membership tiers */
  tiers?: MembershipTier[];
  /** Only users with one of these roles */
  roles?: UserRole[];
  /** Only users who have purchased (paid order containing) one of these product IDs */
  purchasedProductIds?: string[];
  /** Only users enrolled in one of these course IDs */
  enrolledCourseIds?: string[];
  /** Only users last active before this many days ago (i.e. inactive users) */
  lastActiveBeforeDays?: number;
  /** Only users last active within this many days (i.e. active users) */
  lastActiveAfterDays?: number;
  /** Only users who have ALL of these tags */
  tags?: string[];
  /** Exclude users who have ANY of these tags */
  excludeTags?: string[];
  /** Only users with leadScore >= this value */
  minLeadScore?: number;
  /** Only users with leadScore <= this value */
  maxLeadScore?: number;
  /** Include users who have unsubscribed from email (default: excluded) */
  includeUnsubscribed?: boolean;
};

/**
 * Resolve a SegmentFilter into a Prisma `User` where clause.
 * "Last active" is approximated via `Streak.lastActiveDate` since User has no
 * dedicated lastActive column; users without a Streak row are treated as
 * inactive (excluded from lastActiveAfterDays, included in lastActiveBeforeDays).
 */
export function resolveSegmentFilter(filter: SegmentFilter | null | undefined): Prisma.UserWhereInput {
  if (!filter) return {};

  const where: Prisma.UserWhereInput = {};
  const and: Prisma.UserWhereInput[] = [];

  if (filter.tiers?.length) {
    where.membershipTier = { in: filter.tiers };
  }

  if (filter.roles?.length) {
    where.role = { in: filter.roles };
  }

  if (filter.purchasedProductIds?.length) {
    and.push({
      storeOrders: {
        some: {
          status: { in: ['PAID', 'FULFILLED'] },
          items: { some: { productId: { in: filter.purchasedProductIds } } },
        },
      },
    });
  }

  if (filter.enrolledCourseIds?.length) {
    and.push({
      enrollments: { some: { courseId: { in: filter.enrolledCourseIds } } },
    });
  }

  if (typeof filter.lastActiveBeforeDays === 'number') {
    const cutoff = new Date(Date.now() - filter.lastActiveBeforeDays * 24 * 60 * 60 * 1000);
    and.push({
      OR: [{ streak: null }, { streak: { lastActiveDate: { lt: cutoff } } }],
    });
  }

  if (typeof filter.lastActiveAfterDays === 'number') {
    const cutoff = new Date(Date.now() - filter.lastActiveAfterDays * 24 * 60 * 60 * 1000);
    and.push({
      streak: { lastActiveDate: { gte: cutoff } },
    });
  }

  if (filter.tags?.length) {
    // Prisma's `hasEvery` requires the user to have ALL listed tags.
    and.push({ tags: { hasEvery: filter.tags } });
  }

  if (filter.excludeTags?.length) {
    and.push({ NOT: { tags: { hasSome: filter.excludeTags } } });
  }

  if (typeof filter.minLeadScore === 'number' || typeof filter.maxLeadScore === 'number') {
    where.leadScore = {
      ...(typeof filter.minLeadScore === 'number' ? { gte: filter.minLeadScore } : {}),
      ...(typeof filter.maxLeadScore === 'number' ? { lte: filter.maxLeadScore } : {}),
    };
  }

  if (and.length) where.AND = and;

  // Segments never target unsubscribed users unless explicitly opted in.
  if (!filter.includeUnsubscribed) {
    where.emailUnsubscribed = false;
  }

  return where;
}
