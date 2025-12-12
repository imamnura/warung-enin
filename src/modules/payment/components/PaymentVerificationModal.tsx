"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { X, CheckCircle, XCircle, Package, User, Phone } from "lucide-react";
import { verifyPayment } from "@/modules/payment/actions";
import { toast } from "sonner";
import Image from "next/image";

interface PaymentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
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
  };
  adminId: string;
}

export function PaymentVerificationModal({
  isOpen,
  onClose,
  payment,
  adminId,
}: PaymentVerificationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleVerify = async (approved: boolean) => {
    setIsProcessing(true);
    try {
      await verifyPayment(payment.id, approved, adminId, notes || undefined);
      toast.success(
        approved
          ? "Pembayaran berhasil diverifikasi! Pesanan akan diproses."
          : "Pembayaran ditolak."
      );
      onClose();
      window.location.reload(); // Refresh data
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal verifikasi pembayaran"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Verifikasi Pembayaran
              </h2>
              <p className="text-white/90 text-sm">
                Order #{payment.order.orderNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informasi Customer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-semibold text-gray-900">
                  {payment.order.customer.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <Phone className="w-4 h-4 inline mr-1" />
                  WhatsApp
                </p>
                <p className="font-semibold text-gray-900">
                  {payment.order.customer.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Detail Pesanan</h3>
            <div className="space-y-2 mb-4">
              {payment.order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.menu.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="border-t border-gray-300 pt-3 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>Rp {payment.order.subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Ongkir</span>
                <span>
                  Rp {payment.order.deliveryFee.toLocaleString("id-ID")}
                </span>
              </div>
              {payment.order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon</span>
                  <span>
                    -Rp {payment.order.discount.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                <span>Total Pembayaran</span>
                <span className="text-primary">
                  Rp {payment.order.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Proof Image */}
          {payment.proofImage && (
            <div className="bg-white rounded-xl border-2 border-yellow-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">
                Bukti Pembayaran
              </h3>
              <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={payment.proofImage}
                  alt="Bukti Pembayaran"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Upload:{" "}
                {new Date(payment.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan jika diperlukan..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => handleVerify(false)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Proses...
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 mr-2" />
                  Tolak
                </>
              )}
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => handleVerify(true)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Proses...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
