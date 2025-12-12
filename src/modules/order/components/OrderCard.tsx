"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/shared/utils/price";
import { Badge } from "@/shared/ui/Badge";

type OrderCardProps = {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    deliveryMethod: string;
    totalPrice: number;
    createdAt: Date;
    items: Array<{
      quantity: number;
      menu: {
        name: string;
        images: string[];
      };
    }>;
  };
};

const statusConfig = {
  ORDERED: { label: "Pesanan Diterima", color: "primary" as const },
  PROCESSED: { label: "Sedang Diproses", color: "warning" as const },
  ON_DELIVERY: { label: "Dalam Pengiriman", color: "warning" as const },
  READY: { label: "Siap Diambil", color: "success" as const },
  COMPLETED: { label: "Selesai", color: "success" as const },
  CANCELLED: { label: "Dibatalkan", color: "destructive" as const },
};

export function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status as keyof typeof statusConfig] || {
    label: order.status,
    color: "primary" as const,
  };

  return (
    <Link href={`/profile/orders/${order.id}`}>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Badge color={status.color}>{status.label}</Badge>
        </div>

        <div className="flex gap-2 mb-3 overflow-x-auto">
          {order.items.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-gray-100"
            >
              {item.menu.images[0] ? (
                <Image
                  src={item.menu.images[0]}
                  alt={item.menu.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="h-16 w-16 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-medium">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
            </p>
            <p className="text-sm text-gray-500">
              {order.deliveryMethod === "DIANTAR" ? "Diantar" : "Ambil Sendiri"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="font-bold text-lg text-primary">
              {formatPrice(order.totalPrice)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
