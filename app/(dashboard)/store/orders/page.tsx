"use client";

import Link from "next/link";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
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
