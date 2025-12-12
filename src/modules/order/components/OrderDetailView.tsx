"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { formatPrice } from "@/shared/utils/price";
import { ReorderButton } from "./ReorderButton";
import { WriteReviewModal } from "@/modules/review/components/WriteReviewModal";

type OrderDetailViewProps = {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    deliveryMethod: string;
    address: string | null;
    notes: string | null;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    totalPrice: number;
    createdAt: Date;
    items: Array<{
      id: string;
      menuId: string;
      quantity: number;
      price: number;
      notes: string | null;
      menu: {
        name: string;
        images: string[];
      };
    }>;
    customer: {
      name: string;
      phone: string;
      email: string | null;
    };
    courier: {
      name: string;
      phone: string;
    } | null;
    payment: {
      status: string;
      method: string;
      amount: number;
      paidAt: Date | null;
    } | null;
  };
  userId: string;
};

const statusConfig = {
  ORDERED: { label: "Pesanan Diterima", color: "primary" as const },
  PROCESSED: { label: "Sedang Diproses", color: "warning" as const },
  ON_DELIVERY: { label: "Dalam Pengiriman", color: "warning" as const },
  READY: { label: "Siap Diambil", color: "success" as const },
  COMPLETED: { label: "Selesai", color: "success" as const },
  CANCELLED: { label: "Dibatalkan", color: "destructive" as const },
};

const paymentStatusConfig = {
  PENDING: { label: "Menunggu Pembayaran", color: "warning" as const },
  PAID: { label: "Lunas", color: "success" as const },
  FAILED: { label: "Gagal", color: "destructive" as const },
  REFUNDED: { label: "Dikembalikan", color: "primary" as const },
};

export function OrderDetailView({ order, userId }: OrderDetailViewProps) {
  const [reviewingItem, setReviewingItem] = useState<{
    menuId: string;
    menuName: string;
  } | null>(null);

  const status = statusConfig[order.status as keyof typeof statusConfig] || {
    label: order.status,
    color: "primary" as const,
  };

  const paymentStatus = order.payment
    ? paymentStatusConfig[
        order.payment.status as keyof typeof paymentStatusConfig
      ] || {
        label: order.payment.status,
        color: "primary" as const,
      }
    : null;

  const isCompleted = order.status === "COMPLETED";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
              <p className="text-gray-600 mt-1">
                Dipesan pada{" "}
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <Link href="/profile/orders">
              <Button variant="outline">Kembali</Button>
            </Link>
          </div>

          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Status Pesanan</h2>
              <div className="flex items-center gap-4">
                <Badge color={status.color} className="text-lg px-4 py-2">
                  {status.label}
                </Badge>
                {paymentStatus && (
                  <Badge
                    color={paymentStatus.color}
                    className="text-lg px-4 py-2"
                  >
                    {paymentStatus.label}
                  </Badge>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Item Pesanan</h2>
              <div className="space-y-4">
                {order.items.map(
                  (item: OrderDetailViewProps["order"]["items"][0]) => (
                    <div key={item.id} className="border-b pb-4 last:border-0">
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
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
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.menu.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          {item.notes && (
                            <p className="text-sm text-gray-500 mt-1">
                              Catatan: {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Review Button for completed orders */}
                      {isCompleted && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            onClick={() =>
                              setReviewingItem({
                                menuId: item.menuId,
                                menuName: item.menu.name,
                              })
                            }
                            className="text-sm"
                          >
                            ⭐ Tulis Review
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="border-t mt-6 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Pengiriman</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Informasi Pengiriman
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Metode</p>
                  <p className="font-medium">
                    {order.deliveryMethod === "DIANTAR"
                      ? "Diantar ke Alamat"
                      : "Ambil Sendiri"}
                  </p>
                </div>
                {order.address && (
                  <div>
                    <p className="text-sm text-gray-600">Alamat Pengiriman</p>
                    <p className="font-medium">{order.address}</p>
                  </div>
                )}
                {order.courier && (
                  <div>
                    <p className="text-sm text-gray-600">Kurir</p>
                    <p className="font-medium">{order.courier.name}</p>
                    <p className="text-sm text-gray-500">
                      {order.courier.phone}
                    </p>
                  </div>
                )}
                {order.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Catatan</p>
                    <p className="font-medium">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Pemesan</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">No. Telepon</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
                {order.customer.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{order.customer.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            {order.payment && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Informasi Pembayaran
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Metode Pembayaran</p>
                    <p className="font-medium">{order.payment.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jumlah</p>
                    <p className="font-medium">
                      {formatPrice(order.payment.amount)}
                    </p>
                  </div>
                  {order.payment.paidAt && (
                    <div>
                      <p className="text-sm text-gray-600">Dibayar Pada</p>
                      <p className="font-medium">
                        {new Date(order.payment.paidAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            {isCompleted && (
              <div className="flex gap-4">
                <ReorderButton orderId={order.id} />
                <Link href="/track" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Lacak Pesanan Lain
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Review Modal */}
      {reviewingItem && (
        <WriteReviewModal
          userId={userId}
          menuId={reviewingItem.menuId}
          menuName={reviewingItem.menuName}
          orderId={order.id}
          isOpen={!!reviewingItem}
          onClose={() => setReviewingItem(null)}
        />
      )}
    </div>
  );
}
