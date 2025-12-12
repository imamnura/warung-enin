"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { PaymentVerificationModal } from "@/modules/payment/components/PaymentVerificationModal";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { CheckCircle2, Clock, Package, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Payment {
  id: string;
  amount: number;
  proofImage: string | null;
  createdAt: Date;
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
    items: Array<{
      quantity: number;
      price: number;
      menu: {
        name: string;
      };
    }>;
  };
}

interface PaymentVerificationListProps {
  payments: Payment[];
}

export function PaymentVerificationList({
  payments,
}: PaymentVerificationListProps) {
  const { data: session } = useSession();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerifyClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-green-50 p-6 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Semua Terverifikasi!
            </h3>
            <p className="text-gray-600">
              Tidak ada pembayaran yang menunggu verifikasi
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left: Payment Proof Image */}
              <div className="lg:w-1/3 bg-gray-100">
                {payment.proofImage ? (
                  <div className="relative h-64 lg:h-full">
                    <Image
                      src={payment.proofImage}
                      alt="Bukti Pembayaran"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-64 lg:h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Tidak ada bukti</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Payment Details */}
              <div className="lg:w-2/3 p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-bold text-gray-900">
                        Order #{payment.order.orderNumber}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(payment.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <Badge color="warning">Pending</Badge>
                </div>

                {/* Customer Info */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-semibold text-gray-900">
                        {payment.order.customer.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">WhatsApp</p>
                      <p className="font-semibold text-gray-900">
                        {payment.order.customer.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  <div className="space-y-1">
                    {payment.order.items.map((item, index) => (
                      <p key={index} className="text-sm text-gray-700">
                        • {item.quantity}x {item.menu.name}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                  <div>
                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-primary">
                      Rp {payment.order.totalPrice.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleVerifyClick(payment)}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Verifikasi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Modal */}
      {selectedPayment && (
        <PaymentVerificationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          payment={selectedPayment}
          adminId={session?.user?.id || ""}
        />
      )}
    </>
  );
}
