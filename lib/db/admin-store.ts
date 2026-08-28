import prisma from "@/lib/db/prisma";
import { Prisma, ProductType } from "@/lib/generated/prisma/client";

export function isUniqueConstraintError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

// ── Admin Products ──────────────────────────────────────────────────────

export interface AdminProductFilters {
  type?: ProductType;
  search?: string;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
}

export async function getAdminProducts(filters: AdminProductFilters = {}) {
  const where: Prisma.ProductWhereInput = {};
  if (filters.type) where.type = filters.type;
  if (filters.isPublished !== undefined) where.isPublished = filters.isPublished;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { slug: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        _count: { select: { reviews: true, orders: true } },
        bundleItems: { include: { product: { select: { id: true, title: true, slug: true, price: true } } } },
        upsellProduct: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      bundleItems: { include: { product: { select: { id: true, title: true, slug: true, price: true, type: true } } } },
      upsellProduct: { select: { id: true, title: true, slug: true, price: true } },
    },
  });
}

export interface BundleItemInput {
  productId: string;
  quantity?: number;
}

export interface AdminProductInput {
  title: string;
  slug: string;
  description: string;
  type?: ProductType;
  price: number;
  compareAt?: number | null;
  currency?: string;
  images?: string[];
  stock?: number;
  isPublished?: boolean;
  metadata?: Record<string, unknown> | null;
  stripePriceId?: string | null;
  recurringInterval?: string | null;
  trialDays?: number | null;
  upsellProductId?: string | null;
  bundleItems?: BundleItemInput[];
}

export async function createAdminProduct(input: AdminProductInput) {
  const { bundleItems, ...data } = input;

  return prisma.product.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      type: data.type ?? "DIGITAL",
      price: data.price,
      compareAt: data.compareAt ?? null,
      currency: data.currency ?? "USD",
      images: data.images ?? [],
      stock: data.stock ?? 0,
      isPublished: data.isPublished ?? false,
      metadata: (data.metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      stripePriceId: data.stripePriceId ?? null,
      recurringInterval: data.recurringInterval ?? null,
      trialDays: data.trialDays ?? null,
      upsellProductId: data.upsellProductId ?? null,
      ...(bundleItems && bundleItems.length > 0
        ? {
            bundleItems: {
              create: bundleItems.map((b) => ({ productId: b.productId, quantity: b.quantity ?? 1 })),
            },
          }
        : {}),
    },
    include: { bundleItems: true },
  });
}

export async function updateAdminProduct(id: string, input: Partial<AdminProductInput>) {
  const { bundleItems, ...data } = input;

  if (bundleItems !== undefined) {
    await prisma.bundleItem.deleteMany({ where: { bundleId: id } });
    if (bundleItems.length > 0) {
      await prisma.bundleItem.createMany({
        data: bundleItems.map((b) => ({ bundleId: id, productId: b.productId, quantity: b.quantity ?? 1 })),
      });
    }
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.compareAt !== undefined ? { compareAt: data.compareAt } : {}),
      ...(data.currency !== undefined ? { currency: data.currency } : {}),
      ...(data.images !== undefined ? { images: data.images } : {}),
      ...(data.stock !== undefined ? { stock: data.stock } : {}),
      ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
      ...(data.metadata !== undefined ? { metadata: (data.metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue } : {}),
      ...(data.stripePriceId !== undefined ? { stripePriceId: data.stripePriceId } : {}),
      ...(data.recurringInterval !== undefined ? { recurringInterval: data.recurringInterval } : {}),
      ...(data.trialDays !== undefined ? { trialDays: data.trialDays } : {}),
      ...(data.upsellProductId !== undefined ? { upsellProductId: data.upsellProductId } : {}),
    },
    include: { bundleItems: true },
  });
}

export async function deleteAdminProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

// ── Admin Coupons ────────────────────────────────────────────────────────

export async function getAdminCoupons(params: { search?: string; limit?: number; offset?: number } = {}) {
  const where: Prisma.CouponWhereInput = {};
  if (params.search) {
    where.OR = [
      { code: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      include: { product: { select: { id: true, title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.coupon.count({ where }),
  ]);

  return { coupons, total };
}

export async function getAdminCouponById(id: string) {
  return prisma.coupon.findUnique({
    where: { id },
    include: { product: { select: { id: true, title: true, slug: true } } },
  });
}

export interface CouponInput {
  code: string;
  description?: string | null;
  discountType: "PERCENT" | "FIXED";
  amount: number;
  currency?: string;
  productId?: string | null;
  maxUses?: number | null;
  expiresAt?: string | Date | null;
  isActive?: boolean;
}

export async function createAdminCoupon(input: CouponInput, stripePromotionCodeId?: string | null) {
  return prisma.coupon.create({
    data: {
      code: input.code.toUpperCase(),
      description: input.description ?? null,
      discountType: input.discountType,
      amount: input.amount,
      currency: input.currency ?? "USD",
      productId: input.productId ?? null,
      maxUses: input.maxUses ?? null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      isActive: input.isActive ?? true,
      stripePromotionCodeId: stripePromotionCodeId ?? null,
    },
  });
}

export async function updateAdminCoupon(id: string, input: Partial<CouponInput>, stripePromotionCodeId?: string | null) {
  return prisma.coupon.update({
    where: { id },
    data: {
      ...(input.code !== undefined ? { code: input.code.toUpperCase() } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.discountType !== undefined ? { discountType: input.discountType } : {}),
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.productId !== undefined ? { productId: input.productId } : {}),
      ...(input.maxUses !== undefined ? { maxUses: input.maxUses } : {}),
      ...(input.expiresAt !== undefined ? { expiresAt: input.expiresAt ? new Date(input.expiresAt) : null } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(stripePromotionCodeId !== undefined ? { stripePromotionCodeId } : {}),
    },
  });
}

export async function deleteAdminCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } });
}

// ── Coupon validation / application ─────────────────────────────────────

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  coupon?: Awaited<ReturnType<typeof getCouponByCode>>;
  discountAmount?: number;
  newTotal?: number;
}

export async function getCouponByCode(code: string) {
  return prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
}

/**
 * Validates a coupon code against scope, expiry, and max uses, and computes
 * the discounted total for the given subtotal / product IDs in the cart.
 */
export async function validateAndComputeCoupon(params: {
  code: string;
  subtotal: number;
  productIds?: string[];
}): Promise<CouponValidationResult> {
  const coupon = await getCouponByCode(params.code);

  if (!coupon) return { valid: false, error: "Coupon not found" };
  if (!coupon.isActive) return { valid: false, error: "Coupon is not active" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, error: "Coupon has expired" };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: "Coupon has reached its usage limit" };
  }
  if (coupon.productId && !(params.productIds ?? []).includes(coupon.productId)) {
    return { valid: false, error: "Coupon does not apply to items in your cart" };
  }

  const discountAmount =
    coupon.discountType === "PERCENT"
      ? Math.round(params.subtotal * (coupon.amount / 100) * 100) / 100
      : Math.min(coupon.amount, params.subtotal);

  const newTotal = Math.max(0, Math.round((params.subtotal - discountAmount) * 100) / 100);

  return { valid: true, coupon, discountAmount, newTotal };
}

// ── Admin Orders ─────────────────────────────────────────────────────────

export interface AdminOrderFilters {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getAdminOrders(filters: AdminOrderFilters = {}) {
  const where: Prisma.StoreOrderWhereInput = {};
  if (filters.status) where.status = filters.status as Prisma.StoreOrderWhereInput["status"];
  if (filters.search) {
    where.user = {
      OR: [
        { email: { contains: filters.search, mode: "insensitive" } },
        { name: { contains: filters.search, mode: "insensitive" } },
      ],
    };
  }

  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  const [orders, total] = await Promise.all([
    prisma.storeOrder.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.storeOrder.count({ where }),
  ]);

  return { orders, total };
}

export async function getAdminOrderById(id: string) {
  return prisma.storeOrder.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: { select: { id: true, title: true, slug: true, type: true, metadata: true } } } },
      couponRedemptions: { include: { coupon: { select: { code: true, discountType: true, amount: true } } } },
    },
  });
}
