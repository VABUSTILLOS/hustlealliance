"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, CreditCard } from "lucide-react";
import { CartItem, type CartItemData } from "../components/CartItem";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

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

  useEffect(() => {
    const handler = () => setCart(loadCart());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

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

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        }),
      });
      if (!res.ok) throw new Error(getErrorMsg("checkoutFailed"));
      localStorage.removeItem("ha-cart");
      window.dispatchEvent(new Event("cart-updated"));
      router.push(`/store/orders`);
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

        <div className="border-t p-4 sm:p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">{t.store.subtotal}</span>
            <span className="text-lg font-semibold text-gray-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            {checkingOut ? t.store.buttonProcessing : `${t.store.buttonCheckout} — $${subtotal.toFixed(2)}`}
          </button>

          <p className="mt-3 text-xs text-gray-400 text-center">
            {t.store.stripeNote}
          </p>
        </div>
      </div>
    </div>
  );
}
