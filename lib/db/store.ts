import prisma from "@/lib/db/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import type { ProductType, StoreOrderStatus } from "@/lib/generated/prisma/client";

// ── Products ────────────────────────────────────────────────────────────

export interface ProductFilters {
  type?: ProductType;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  cursor?: string;
}

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
      upsellProduct: { select: { id: true, title: true, slug: true, price: true, images: true } },
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
      upsellProduct: { select: { id: true, title: true, slug: true, price: true, images: true } },
    },
  });
}

export async function getProducts(filters: ProductFilters = {}) {
  const where: Record<string, unknown> = { isPublished: true };

  if (filters.type) where.type = filters.type;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  return prisma.product.findMany({
    where,
    include: {
      _count: { select: { reviews: true } },
    },
    take: filters.limit ?? 20,
    ...(filters.cursor ? { cursor: { id: filters.cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}

export async function listProducts(params: {
  type?: ProductType;
  limit?: number;
  cursor?: string;
}) {
  return getProducts(params);
}

export async function updateProduct(
  productId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    compareAt?: number;
    images?: string[];
    stock?: number;
    isPublished?: boolean;
    metadata?: Record<string, unknown>;
  },
) {
  // Admin guard — in production, check user role
  return prisma.product.update({
    where: { id: productId },
    data: {
      ...data,
      metadata: data.metadata !== undefined
        ? (data.metadata as Prisma.InputJsonValue)
        : undefined,
    },
  });
}

export async function updateProductSimple(id: string, data: {
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

export async function deleteProduct(productId: string, _userId: string) {
  return prisma.product.delete({ where: { id: productId } });
}

// ── Cart (session-based with DB persistence) ────────────────────────────

export async function addToCart(userId: string, productId: string, quantity: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isPublished) throw new Error("Product not available");

  // Use a simple approach: store cart items as metadata on user session
  // For now, we return the item — actual cart persistence uses client state
  return {
    productId: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    image: product.images?.[0] ?? null,
    quantity,
    subtotal: product.price * quantity,
  };
}

export async function getCart(userId: string) {
  // Placeholder: cart is primarily managed client-side via zustand/localStorage
  // Server returns basic user context
  return { userId, items: [] as Awaited<ReturnType<typeof addToCart>>[] };
}

// ── Orders ──────────────────────────────────────────────────────────────

export async function createOrder(params: {
  userId: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  currency?: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
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

export async function getOrders(userId: string) {
  return prisma.storeOrder.findMany({
    where: { userId },
    include: { items: { include: { product: { select: { id: true, title: true, slug: true, images: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserOrders(userId: string) {
  return getOrders(userId);
}

export async function getOrder(orderId: string, userId: string) {
  const order = await prisma.storeOrder.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Not authorized to view this order");
  return order;
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

export async function addReview(params: {
  productId: string;
  userId: string;
  rating: number;
  content?: string;
}) {
  if (params.rating < 1 || params.rating > 5) throw new Error("Rating must be 1-5");

  return prisma.storeReview.create({
    data: {
      productId: params.productId,
      userId: params.userId,
      rating: params.rating,
      body: params.content ?? null,
    },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });
}

export async function createReview(params: {
  productId: string;
  userId: string;
  rating: number;
  body?: string;
}) {
  return addReview({ ...params, content: params.body });
}

export async function getProductReviews(
  productId: string,
  cursor?: string,
  limit = 20,
) {
  return prisma.storeReview.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}
