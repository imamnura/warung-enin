"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/shared/ui/Button";

interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: string | null;
  isActive: boolean;
}

interface AssignCourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderNumber: string;
    courierId: string | null;
  };
  onUpdate: () => void;
}

export function AssignCourierModal({
  isOpen,
  onClose,
  order,
  onUpdate,
}: AssignCourierModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string>(
    order.courierId || ""
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCouriers();
    }
  }, [isOpen]);

  const fetchCouriers = async () => {
    try {
      const response = await fetch("/api/couriers");
      if (!response.ok) throw new Error("Gagal memuat data kurir");
      const data = await response.json();
      setCouriers(data.filter((c: Courier) => c.isActive));
    } catch (error) {
      console.error("Error fetching couriers:", error);
      toast.error("Gagal memuat data kurir");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourierId) {
      toast.error("Pilih kurir terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders/assign-courier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          courierId: selectedCourierId,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal assign kurir");
      }

      toast.success("Kurir berhasil di-assign");
      onUpdate();
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error assigning courier:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal assign kurir"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-bold">Assign Kurir</h2>
          <p className="text-sm text-gray-600 mt-1">
            Order: {order.orderNumber}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Memuat data kurir...</p>
            </div>
          ) : couriers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Tidak ada kurir aktif tersedia</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">
                Pilih Kurir
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {couriers.map((courier) => (
                  <label
                    key={courier.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCourierId === courier.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="courier"
                      value={courier.id}
                      checked={selectedCourierId === courier.id}
                      onChange={(e) => setSelectedCourierId(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium">{courier.name}</p>
                      <p className="text-sm text-gray-600">{courier.phone}</p>
                      {courier.vehicle && (
                        <p className="text-xs text-gray-500">
                          Kendaraan: {courier.vehicle}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

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
              disabled={isSubmitting || loading || !selectedCourierId}
              className="flex-1 bg-gradient-primary hover:bg-gradient-primary-hover"
            >
              {isSubmitting ? "Memproses..." : "Assign Kurir"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
