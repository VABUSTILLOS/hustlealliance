"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, CreditCard } from "lucide-react";
import { CartItem, type CartItemData } from "../components/CartItem";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";
import { getAttribution } from "@/app/components/page-tracker";

function loadCart(): CartItemData[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("ha-cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function CartPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [cart, setCart] = useState<CartItemData[]>(loadCart);
  const [checkingOut, setCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<{ valid: boolean; error?: string; discountAmount?: number; newTotal?: number } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [bumpProduct, setBumpProduct] = useState<{ id: string; title: string; price: number; images: string[] } | null>(null);
  const [bumpAccepted, setBumpAccepted] = useState(false);

  useEffect(() => {
    const handler = () => setCart(loadCart());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  // Look up an order-bump / upsell offer tied to the first cart item.
  useEffect(() => {
    if (cart.length === 0) {
      setBumpProduct(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/store/products/${cart[0].productId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.upsellProduct) return;
        setBumpProduct(data.upsellProduct);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [cart.length > 0 ? cart[0].productId : null]);

  const saveCart = (items: CartItemData[]) => {
    setCart(items);
    localStorage.setItem("ha-cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    saveCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    saveCart(cart.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const bumpTotal = bumpAccepted && bumpProduct ? bumpProduct.price : 0;
  const displayTotal = (couponStatus?.valid ? couponStatus.newTotal ?? subtotal : subtotal) + bumpTotal;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponStatus(null);
    try {
      const res = await fetch("/api/store/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal,
          productIds: cart.map((item) => item.productId),
        }),
      });
      const data = await res.json();
      setCouponStatus(data);
    } catch {
      setCouponStatus({ valid: false, error: "Failed to validate coupon" });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "store",
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          ...(couponStatus?.valid ? { couponCode: couponCode.trim() } : {}),
          ...(bumpAccepted && bumpProduct ? { bumpProductId: bumpProduct.id } : {}),
          successUrl: `${window.location.origin}/store/orders?checkout=success${!bumpAccepted && bumpProduct ? `&upsell=${bumpProduct.id}` : ""}`,
          cancelUrl: `${window.location.origin}/store/cart?checkout=cancelled`,
          attribution: (() => {
            try {
              const a = getAttribution();
              const ref = new URLSearchParams(window.location.search).get("ref");
              return { ...a, path: "/store/cart", ...(ref ? { referralCode: ref } : {}) };
            } catch {
              return undefined;
            }
          })(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || getErrorMsg("checkoutFailed"));
      localStorage.removeItem("ha-cart");
      window.dispatchEvent(new Event("cart-updated"));
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push(`/store/orders`);
      }
    } catch {
      alert(t.store.errorCheckoutFailed);
    } finally {
      setCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto text-center">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">{t.store.emptyCartTitle}</h1>
        <p className="text-gray-500 mt-1 mb-6">{t.store.emptyCartHelp}</p>
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
        >
          {t.store.buttonContinueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto">
      <Link
        href="/store"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.store.buttonContinueShopping}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-blue-600" />
        {t.store.cartTitle.replace("{count}", String(cart.length))}
      </h1>

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="p-4 sm:p-6 divide-y">
          {cart.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {bumpProduct && (
          <div className="mx-4 sm:mx-6 mb-4 p-4 rounded-xl border border-dashed border-blue-300 bg-blue-50">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={bumpAccepted}
                onChange={(e) => setBumpAccepted(e.target.checked)}
                className="mt-1"
              />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-gray-900">
                  Add {bumpProduct.title} for just ${bumpProduct.price.toFixed(2)}?
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">One-click add — pairs perfectly with your order.</span>
              </span>
            </label>
          </div>
        )}

        <div className="mx-4 sm:mx-6 mb-4 flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon code"
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={applyingCoupon || !couponCode.trim()}
            className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {applyingCoupon ? "Applying…" : "Apply"}
          </button>
        </div>
        {couponStatus && (
          <p className={`mx-4 sm:mx-6 mb-4 text-xs ${couponStatus.valid ? "text-green-600" : "text-red-500"}`}>
            {couponStatus.valid
              ? `Coupon applied — saved $${couponStatus.discountAmount?.toFixed(2)}`
              : couponStatus.error}
          </p>
        )}

        <div className="border-t p-4 sm:p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600">{t.store.subtotal}</span>
            <span className="text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          {couponStatus?.valid && (
            <div className="flex items-center justify-between mb-1 text-green-600 text-sm">
              <span>Discount</span>
              <span>-${couponStatus.discountAmount?.toFixed(2)}</span>
            </div>
          )}
          {bumpAccepted && bumpProduct && (
            <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
              <span>{bumpProduct.title}</span>
              <span>+${bumpProduct.price.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-lg font-semibold text-gray-900">
              ${displayTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            {checkingOut ? t.store.buttonProcessing : `${t.store.buttonCheckout} — $${displayTotal.toFixed(2)}`}
          </button>

          <p className="mt-3 text-xs text-gray-400 text-center">
            {t.store.stripeNote}
          </p>
        </div>
      </div>
    </div>
  );
}
