"use client";

import { useState } from "react";
import { updatePaymentStatus } from "@/modules/payment/actions";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { formatPrice } from "@/shared/utils/price";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Payment {
  id: string;
  transactionId: string | null;
  status:
    | "PENDING"
    | "VERIFIED"
    | "PAID"
    | "HANDED_OVER"
    | "FAILED"
    | "REFUNDED";
  method: string;
  amount: number;
  createdAt: Date;
  paidAt: Date | null;
  order: {
    orderNumber: string;
    customer: {
      name: string;
      phone: string | null;
    };
  };
}

interface PaymentTableProps {
  payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const statusColors = {
    PENDING: "warning",
    VERIFIED: "primary",
    PAID: "success",
    HANDED_OVER: "success",
    FAILED: "destructive",
    REFUNDED: "primary",
  } as const;

  const handleStatusUpdate = async (
    paymentId: string,
    newStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  ) => {
    setUpdating(paymentId);
    const result = await updatePaymentStatus(paymentId, newStatus);

    if (result.success) {
      toast.success("Status pembayaran berhasil diupdate");
      router.refresh();
    } else {
      toast.error(result.error || "Gagal mengupdate status");
    }

    setUpdating(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    {new Date(payment.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(payment.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{payment.order.orderNumber}
                  </div>
                  {payment.transactionId && (
                    <div className="text-xs text-gray-500">
                      TRX: {payment.transactionId}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {payment.order.customer.name}
                  </div>
                  {payment.order.customer.phone && (
                    <div className="text-xs text-gray-500">
                      {payment.order.customer.phone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(payment.amount)}
                  </div>
                  {payment.paidAt && (
                    <div className="text-xs text-green-600">
                      Dibayar:{" "}
                      {new Date(payment.paidAt).toLocaleDateString("id-ID")}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge color={statusColors[payment.status]}>
                    {payment.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {payment.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStatusUpdate(payment.id, "PAID")}
                        disabled={updating === payment.id}
                        className="text-xs px-2 py-1"
                      >
                        {updating === payment.id ? "..." : "Konfirmasi"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(payment.id, "FAILED")}
                        disabled={updating === payment.id}
                        className="text-xs px-2 py-1"
                      >
                        Gagal
                      </Button>
                    </div>
                  )}
                  {payment.status === "PAID" && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(payment.id, "REFUNDED")}
                      disabled={updating === payment.id}
                      className="text-xs px-2 py-1"
                    >
                      Refund
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Tidak ada data pembayaran
        </div>
      )}
    </div>
  );
}
