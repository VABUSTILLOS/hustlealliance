import prisma from "@/lib/db/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import type { ProductType, StoreOrderStatus } from "@/lib/generated/prisma/client";

// ── Products ────────────────────────────────────────────────────────────

export async function createProduct(params: {
  title: string;
  slug: string;
  description: string;
  type?: ProductType;
  price: number;
  compareAt?: number;
  images?: string[];
  stock?: number;
  metadata?: Record<string, unknown>;
}) {
  return prisma.product.create({
    data: {
      title: params.title,
      slug: params.slug,
      description: params.description,
      type: params.type ?? "DIGITAL",
      price: params.price,
      compareAt: params.compareAt ?? null,
      images: params.images ?? [],
      stock: params.stock ?? 0,
      metadata: (params.metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });
}

export async function listProducts(params: {
  type?: ProductType;
  limit?: number;
  cursor?: string;
}) {
  const where: Record<string, unknown> = { isPublished: true };
  if (params.type) where.type = params.type;

  return prisma.product.findMany({
    where,
    include: {
      _count: { select: { reviews: true } },
    },
    take: params.limit ?? 20,
    ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}

export async function updateProduct(id: string, data: {
  title?: string;
  description?: string;
  price?: number;
  compareAt?: number;
  images?: string[];
  stock?: number;
  isPublished?: boolean;
  metadata?: Record<string, unknown>;
}) {
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      metadata: (data.metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

// ── Orders ──────────────────────────────────────────────────────────────

export async function createOrder(params: {
  userId: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  currency?: string;
}) {
  const totalAmount = params.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return prisma.storeOrder.create({
    data: {
      userId: params.userId,
      totalAmount,
      currency: params.currency ?? "USD",
      items: {
        create: params.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });
}

export async function getUserOrders(userId: string) {
  return prisma.storeOrder.findMany({
    where: { userId },
    include: { items: { include: { product: { select: { id: true, title: true, slug: true, images: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string) {
  return prisma.storeOrder.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
  });
}

export async function updateOrderStatus(orderId: string, status: string, stripePaymentIntentId?: string) {
  return prisma.storeOrder.update({
    where: { id: orderId },
    data: {
      status: status as StoreOrderStatus,
      ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}),
      ...(status === "PAID" ? { paidAt: new Date() } : {}),
    },
  });
}

// ── Reviews ─────────────────────────────────────────────────────────────

export async function createReview(params: {
  productId: string;
  userId: string;
  rating: number;
  body?: string;
}) {
  if (params.rating < 1 || params.rating > 5) throw new Error("Rating must be 1-5");

  return prisma.storeReview.create({
    data: {
      productId: params.productId,
      userId: params.userId,
      rating: params.rating,
      body: params.body ?? null,
    },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });
}

export async function getProductReviews(productId: string, limit = 20) {
  return prisma.storeReview.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}
