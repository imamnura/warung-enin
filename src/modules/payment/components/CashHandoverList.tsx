"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { handOverCash } from "@/modules/payment/actions";
import { toast } from "sonner";
import {
  Wallet,
  CheckCircle2,
  DollarSign,
  Calendar,
  User,
  Package,
} from "lucide-react";

interface CashHandover {
  id: string;
  amount: number;
  paidAt: Date | null;
  order: {
    id: string;
    orderNumber: string;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    totalPrice: number;
    customer: {
      name: string;
      phone: string;
    };
    courier: {
      id: string;
      name: string;
      phone: string;
    } | null;
  };
}

interface CashHandoverListProps {
  cashPayments: CashHandover[];
  courierId: string;
}

export function CashHandoverList({
  cashPayments,
  courierId,
}: CashHandoverListProps) {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleHandOver = async (paymentId: string, amount: number) => {
    setProcessing(paymentId);
    try {
      await handOverCash(paymentId, courierId);
      toast.success(
        `Berhasil serahkan cash Rp ${amount.toLocaleString("id-ID")}`
      );
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal serahkan cash"
      );
    } finally {
      setProcessing(null);
    }
  };

  const totalCash = cashPayments.reduce((sum, p) => sum + p.amount, 0);

  if (cashPayments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-green-50 p-6 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Semua Cash Sudah Diserahkan!
            </h3>
            <p className="text-gray-600">
              Tidak ada cash yang perlu diserahkan ke kasir
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">
              Total Cash Belum Diserahkan
            </p>
            <p className="text-4xl font-bold">
              Rp {totalCash.toLocaleString("id-ID")}
            </p>
            <p className="text-white/80 text-sm mt-2">
              {cashPayments.length} transaksi
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
            <Wallet className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      {/* Cash List */}
      <div className="grid gap-4">
        {cashPayments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left: Payment Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Order #{payment.order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {payment.order.customer.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">
                      Rp {payment.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString("id-ID")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{payment.order.customer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Right: Action Button */}
              <div className="flex items-center gap-3">
                <Badge color="warning">Belum Diserahkan</Badge>
                <Button
                  variant="primary"
                  onClick={() => handleHandOver(payment.id, payment.amount)}
                  disabled={processing === payment.id}
                >
                  {processing === payment.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Proses...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Serahkan ke Kasir
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
