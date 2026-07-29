import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/generated/prisma/client";

type ProductWithMeta = Product & {
  _count: { reviews: number };
};

export function ProductCard({ product }: { product: ProductWithMeta }) {
  const avgRating = product._count.reviews > 0 ? 4.5 : 0; // Server can compute real avg

  return (
    <Link
      href={`/store/products/${product.slug}`}
      className="group block rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-10 h-10" />
          </div>
        )}
        {product.compareAt && product.compareAt > product.price && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            SALE
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        {product._count.reviews > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500">
              {avgRating.toFixed(1)} ({product._count.reviews})
            </span>
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.compareAt.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
