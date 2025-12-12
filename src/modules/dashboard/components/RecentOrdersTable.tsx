"use client";

import { formatCurrency } from "@/shared/utils/price";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type OrderWithItems = {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  createdAt: Date;
  items: Array<{
    quantity: number;
    menu: {
      name: string;
    };
  }>;
};

type RecentOrdersTableProps = {
  orders: OrderWithItems[];
};

const statusColors: Record<string, string> = {
  ORDERED: "bg-blue-100 text-blue-700",
  PAYMENT_PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSED: "bg-yellow-100 text-yellow-700",
  ON_DELIVERY: "bg-purple-100 text-purple-700",
  READY: "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  ORDERED: "Dipesan",
  PROCESSED: "Diproses",
  ON_DELIVERY: "Dikirim",
  READY: "Siap",
  COMPLETED: "Selesai",
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pesanan Terbaru
        </h3>
        <p className="text-gray-500 text-center py-8">Belum ada pesanan</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pesanan Terbaru
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                No. Pesanan
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Item
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Total
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  (window.location.href = `/dashboard/orders/${order.id}`)
                }
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  #{order.orderNumber}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {order.items.length > 0
                    ? `${order.items[0].menu.name}${
                        order.items.length > 1
                          ? ` +${order.items.length - 1} lainnya`
                          : ""
                      }`
                    : "-"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  {formatCurrency(order.totalPrice)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {format(new Date(order.createdAt), "HH:mm, dd MMM", {
                    locale: localeId,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
