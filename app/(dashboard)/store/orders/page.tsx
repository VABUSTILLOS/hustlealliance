"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, RefreshCw, Sparkles } from "lucide-react";
import { useOrders } from "../components/hooks/useStore";
import { useTranslation } from "@/lib/i18n/useTranslation";

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4" />,
  PAID: <CheckCircle className="w-4 h-4" />,
  FULFILLED: <Package className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
  REFUNDED: <RefreshCw className="w-4 h-4" />,
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FULFILLED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default function OrdersPage() {
  const { t } = useTranslation();
  const { data: orders, isLoading, error } = useOrders();
  const searchParams = useSearchParams();
  const upsellProductId = searchParams.get("upsell");
  const checkoutSuccess = searchParams.get("checkout") === "success";

  const [upsellProduct, setUpsellProduct] = useState<{ id: string; title: string; price: number } | null>(null);
  const [addingUpsell, setAddingUpsell] = useState(false);
  const [upsellDismissed, setUpsellDismissed] = useState(false);

  useEffect(() => {
    if (!checkoutSuccess || !upsellProductId) return;
    let cancelled = false;
    fetch(`/api/store/products/${upsellProductId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setUpsellProduct({ id: data.id, title: data.title, price: data.price });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [checkoutSuccess, upsellProductId]);

  const handleAddUpsell = async () => {
    if (!upsellProduct) return;
    setAddingUpsell(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "store",
          items: [{ productId: upsellProduct.id, quantity: 1 }],
          successUrl: `${window.location.origin}/store/orders?checkout=success`,
          cancelUrl: `${window.location.origin}/store/orders`,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setAddingUpsell(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <Link
        href="/store"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.store.buttonBackToStore}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          {t.store.orderHistoryTitle}
        </h1>
        <p className="text-gray-500 mt-1">{t.store.orderHistorySubtitle}</p>
      </div>

      {upsellProduct && !upsellDismissed && (
        <div className="mb-6 p-4 rounded-xl border border-dashed border-purple-300 bg-purple-50 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Complete your order with {upsellProduct.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Add it now for just ${upsellProduct.price.toFixed(2)} — one click, no re-entering payment info.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddUpsell}
                disabled={addingUpsell}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {addingUpsell ? "Redirecting…" : `Add for $${upsellProduct.price.toFixed(2)}`}
              </button>
              <button
                onClick={() => setUpsellDismissed(true)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {t.store.errorFailedToLoadOrders}
        </div>
      )}

      {orders?.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-2xl border">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">{t.store.emptyOrdersTitle}</h3>
          <p className="text-gray-500 mt-1 mb-4">{t.store.emptyOrdersHelp}</p>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {t.store.buttonBrowseStore}
          </Link>
        </div>
      )}

      {orders?.length > 0 && (
        <div className="space-y-4">
          {orders.map((order: Record<string, unknown> & { id: string }) => (
            <div key={order.id} className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{String(order.id).slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt as string).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_CLASSES[order.status as string] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {STATUS_ICONS[order.status as string] || null}
                  {STATUS_LABELS[order.status as string] || String(order.status)}
                </span>
              </div>

              {Array.isArray(order.items) && (order.items as Array<{ product: { title: string }; quantity: number; unitPrice: number }>).length > 0 && (
                <div className="space-y-2">
                  {(order.items as Array<{ product: { title: string }; quantity: number; unitPrice: number }>).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 truncate flex-1">
                        {item.product?.title ?? "Unknown Product"}
                        <span className="text-gray-400 ml-1">×{item.quantity}</span>
                      </span>
                      <span className="text-gray-600 ml-4">
                        ${item.unitPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {`${(order.items as Array<Record<string, unknown>>)?.length ?? 0} ${t.store.itemsLabel.replace("(s)", ((order.items as Array<unknown>)?.length ?? 0) !== 1 ? "s" : "")}`}
                </span>
                <span className="font-semibold text-gray-900">
                  ${Number(order.totalAmount).toFixed(2)} {order.currency as string || "USD"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
