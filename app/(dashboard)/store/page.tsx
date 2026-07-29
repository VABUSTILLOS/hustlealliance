"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, ShoppingCart } from "lucide-react";
import { ProductCard } from "./components/ProductCard";
import { useStoreProducts } from "./components/hooks/useStore";

const PRODUCT_TYPES = [
  { value: "", label: "All" },
  { value: "DIGITAL", label: "Digital" },
  { value: "PHYSICAL", label: "Physical" },
  { value: "COURSE", label: "Courses" },
  { value: "MEMBERSHIP", label: "Memberships" },
];

export default function StorePage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { data: products, isLoading, error } = useStoreProducts({
    search: search || undefined,
    type: typeFilter || undefined,
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            Store
          </h1>
          <p className="text-gray-500 mt-1">Tools, resources, and gear from the community</p>
        </div>
        <Link
          href="/store/cart"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Cart
        </Link>
      </div>

      {/* Featured Banner */}
      <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white">
        <h2 className="text-xl sm:text-2xl font-bold">Founder Essentials</h2>
        <p className="mt-1 text-blue-100 max-w-md">
          Discover tools, templates, and resources trusted by 2,400+ founders in the Alliance.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {PRODUCT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === t.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          Failed to load products. Please try again.
        </div>
      )}

      {products?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {products && products.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: { id: string } & Record<string, unknown>) => (
            <ProductCard key={product.id} product={product as Parameters<typeof ProductCard>[0]["product"]} />
          ))}
        </div>
      )}
    </div>
  );
}
