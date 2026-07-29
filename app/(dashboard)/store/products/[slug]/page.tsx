"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ShoppingCart, Star, User } from "lucide-react";
import { ProductGallery } from "../../components/ProductGallery";
import { ReviewForm } from "../../components/ReviewForm";
import { useProduct, useProductReviews, useAddReview } from "../../components/hooks/useStore";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: reviews } = useProductReviews(product?.id ?? "");
  const addReview = useAddReview();
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleAddReview = async (data: { rating: number; body: string }) => {
    if (!product) return;
    await addReview.mutateAsync({ productId: product.id, ...data });
    setShowReviewForm(false);
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
        <Link href="/store" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to store
        </Link>
      </div>
    );
  }

  const avgRating = product._count?.reviews > 0
    ? (reviews?.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) ?? 0) / (reviews?.length || 1)
    : 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <Link
        href="/store"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to store
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery images={product.images || []} title={product.title} />

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>

          {avgRating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {avgRating.toFixed(1)} ({product._count?.reviews ?? 0} review{(product._count?.reviews ?? 0) !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-lg text-gray-400 line-through">
                ${product.compareAt.toFixed(2)}
              </span>
            )}
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

          {product.type === "DIGITAL" && (
            <p className="mt-2 text-sm text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
              Digital Product — Instant delivery
            </p>
          )}

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-medium border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                // Add to cart logic — store in state/localStorage
                const cart = JSON.parse(localStorage.getItem("ha-cart") || "[]");
                const existing = cart.find((i: { productId: string }) => i.productId === product.id);
                if (existing) {
                  existing.quantity += quantity;
                  existing.subtotal = existing.quantity * existing.price;
                } else {
                  cart.push({
                    productId: product.id,
                    title: product.title,
                    slug: product.slug,
                    price: product.price,
                    image: product.images?.[0] ?? null,
                    quantity,
                    subtotal: product.price * quantity,
                  });
                }
                localStorage.setItem("ha-cart", JSON.stringify(cart));
                window.dispatchEvent(new Event("cart-updated"));
                alert("Added to cart!");
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart — ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Reviews ({product._count?.reviews ?? 0})
          </h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Star className="w-4 h-4" />
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <ReviewForm onSubmit={handleAddReview} />
          </div>
        )}

        {reviews?.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: { id: string; rating: number; body: string | null; createdAt: string; user: { id: string; name: string; avatar: string | null } }) => (
              <div key={review.id} className="p-4 bg-white border rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {review.user.avatar ? (
                      <img src={review.user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.user.name}</p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.body && <p className="text-sm text-gray-600">{review.body}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}
