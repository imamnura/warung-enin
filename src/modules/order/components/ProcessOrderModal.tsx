"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/shared/ui/Button";

type OrderStatus =
  | "ORDERED"
  | "PAYMENT_PENDING"
  | "PROCESSED"
  | "ON_DELIVERY"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";
type DeliveryMethod = "DIANTAR" | "AMBIL_SENDIRI";

interface ProcessOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    deliveryMethod: DeliveryMethod;
    courierId: string | null;
  };
  onUpdate: () => void;
}

export function ProcessOrderModal({
  isOpen,
  onClose,
  order,
  onUpdate,
}: ProcessOrderModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status
  );

  if (!isOpen) return null;

  // Validate status transition
  const canUpdateStatus = () => {
    // Untuk DIANTAR, harus assign courier dulu sebelum bisa ON_DELIVERY
    if (
      order.deliveryMethod === "DIANTAR" &&
      selectedStatus === "ON_DELIVERY"
    ) {
      if (!order.courierId) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canUpdateStatus()) {
      toast.error("Mohon assign kurir terlebih dahulu untuk pesanan delivery");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          status: selectedStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal update status");
      }

      toast.success("Status pesanan berhasil diupdate");
      onUpdate();
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal update status"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions: {
    value: OrderStatus;
    label: string;
    disabled?: boolean;
  }[] = [
    { value: "ORDERED", label: "Pesanan Masuk" },
    { value: "PROCESSED", label: "Sedang Diproses" },
    {
      value: "ON_DELIVERY",
      label: "Dalam Pengiriman",
      disabled: order.deliveryMethod === "DIANTAR" && !order.courierId,
    },
    { value: "READY", label: "Siap Diambil" },
    { value: "COMPLETED", label: "Selesai" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-bold">Proses Pesanan</h2>
          <p className="text-sm text-gray-600 mt-1">
            Order: {order.orderNumber}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Update Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedStatus === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:bg-gray-50"
                  } ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as OrderStatus)
                    }
                    disabled={option.disabled}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="ml-3">
                    <p className="font-medium">{option.label}</p>
                    {option.disabled && (
                      <p className="text-xs text-red-500">
                        Assign kurir terlebih dahulu
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Metode Pengiriman:</strong>{" "}
              {order.deliveryMethod === "DIANTAR" ? "Delivery" : "Take Away"}
            </p>
            {order.deliveryMethod === "DIANTAR" && (
              <p className="text-sm text-blue-800 mt-1">
                <strong>Kurir:</strong>{" "}
                {order.courierId ? "Sudah assign" : "Belum assign"}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !canUpdateStatus()}
              className="flex-1 bg-gradient-primary hover:bg-gradient-primary-hover"
            >
              {isSubmitting ? "Memproses..." : "Update Status"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
