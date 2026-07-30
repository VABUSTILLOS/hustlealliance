"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export interface CartItemData {
  productId: string;
  title: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
  subtotal: number;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-b-0">
      <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">{t.store.noImageAvailable}</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-1 rounded-md border hover:bg-gray-50 disabled:opacity-30"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="p-1 rounded-md border hover:bg-gray-50"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-right min-w-[80px]">
        <p className="font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
        <button
          onClick={() => onRemove(item.productId)}
          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1"
        >
          <Trash2 className="w-3 h-3" />
          Remove
        </button>
      </div>
    </div>
  );
}
