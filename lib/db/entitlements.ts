import prisma from '@/lib/db/prisma';
import { MembershipTier } from '@/lib/generated/prisma/client';

/** Grant an entitlement (after successful payment) */
export async function grantEntitlement(params: {
  userId: string;
  courseId?: string;
  lessonId?: string;
  price?: number;
  orderId?: string;
}) {
  if (!params.courseId && !params.lessonId) {
    throw new Error('Either courseId or lessonId must be provided');
  }

  return prisma.entitlement.create({
    data: {
      userId: params.userId,
      courseId: params.courseId,
      lessonId: params.lessonId,
      price: params.price,
      orderId: params.orderId,
    },
  });
}

/** Check if a user has an entitlement for specific content */
export async function hasEntitlement(userId: string, courseId?: string, lessonId?: string): Promise<boolean> {
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

/** Get all entitlements for a user */
export async function getUserEntitlements(userId: string) {
  return prisma.entitlement.findMany({
    where: { userId },
    include: {
      course: { select: { id: true, title: true, slug: true, accessLevel: true } },
      lesson: { select: { id: true, title: true, slug: true, accessLevel: true } },
    },
    orderBy: { purchasedAt: 'desc' },
  });
}

/** Update a user's membership tier (e.g. after subscription payment) */
export async function updateMembershipTier(userId: string, tier: MembershipTier, expiresAt?: Date) {
  return prisma.user.update({
    where: { id: userId },
    data: { membershipTier: tier, membershipExpiresAt: expiresAt ?? null },
  });
}

/** Create an order record for a purchase */
export async function createOrder(params: {
  userId: string;
  courseId?: string;
  lessonId?: string;
  amount: number;
}) {
  return prisma.order.create({
    data: {
      userId: params.userId,
      courseId: params.courseId,
      lessonId: params.lessonId,
      amount: params.amount,
    },
  });
}

/** Mark an order as completed and grant the corresponding entitlement */
export async function completeOrder(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');

  const [updatedOrder] = await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' as any },
    }),
    prisma.entitlement.create({
      data: {
        userId: order.userId,
        courseId: order.courseId,
        lessonId: order.lessonId,
        price: order.amount,
        orderId: order.id,
      },
    }),
  ]);

  return updatedOrder;
}
