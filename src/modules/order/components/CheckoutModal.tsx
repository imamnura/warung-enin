"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/modules/order/actions";
import { useCartStore } from "@/modules/order/store";
import { Button } from "@/shared/ui/Button";

type CheckoutFormValues = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: "DIANTAR" | "AMBIL_SENDIRI";
  address?: string;
  notes?: string;
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, clearCart, getTotalPrice } = useCartStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      deliveryMethod: "DIANTAR",
    },
  });

  const deliveryMethod = watch("deliveryMethod");

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrder({
        customer: {
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail || undefined,
        },
        deliveryMethod: data.deliveryMethod,
        address:
          data.deliveryMethod === "DIANTAR" && data.address
            ? data.address
            : undefined,
        notes: data.notes || undefined,
        promoCode: undefined,
        items: items.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          notes: item.notes || undefined,
        })),
      });

      if (result) {
        toast.success("Pesanan berhasil dibuat!");
        clearCart();
        onClose();
        router.push(`/track?order=${result.orderNumber}`);
      } else {
        toast.error("Gagal membuat pesanan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Informasi Pelanggan */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informasi Pelanggan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("customerName", {
                    required: "Nama harus diisi",
                  })}
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Masukkan nama Anda"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("customerPhone", {
                    required: "Nomor WhatsApp harus diisi",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Nomor WhatsApp tidak valid",
                    },
                  })}
                  type="tel"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="08xxxxxxxxxx"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email (Opsional)
                </label>
                <input
                  {...register("customerEmail", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email tidak valid",
                    },
                  })}
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="email@example.com"
                />
                {errors.customerEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customerEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Metode Pengiriman */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Metode Pengiriman</h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  {...register("deliveryMethod")}
                  type="radio"
                  value="DIANTAR"
                  className="w-4 h-4 text-primary"
                />
                <div className="ml-3">
                  <p className="font-medium">Diantar (Delivery)</p>
                  <p className="text-sm text-gray-600">
                    Pesanan akan diantar ke alamat Anda
                  </p>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  {...register("deliveryMethod")}
                  type="radio"
                  value="AMBIL_SENDIRI"
                  className="w-4 h-4 text-primary"
                />
                <div className="ml-3">
                  <p className="font-medium">Ambil Sendiri (Take Away)</p>
                  <p className="text-sm text-gray-600">
                    Ambil pesanan langsung di warung
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Alamat Pengiriman */}
          {deliveryMethod === "DIANTAR" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("address", {
                  required:
                    deliveryMethod === "DIANTAR" ? "Alamat harus diisi" : false,
                })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Masukkan alamat lengkap untuk pengiriman"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          )}

          {/* Catatan */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Tambahkan catatan untuk pesanan Anda"
            />
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>
                Rp {getTotalPrice().toLocaleString("id-ID")}
                {deliveryMethod === "DIANTAR" && (
                  <span className="text-sm font-normal text-gray-600">
                    {" "}
                    + ongkir
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
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
              disabled={isSubmitting}
              className="flex-1 bg-gradient-primary hover:bg-gradient-primary-hover"
            >
              {isSubmitting ? "Memproses..." : "Buat Pesanan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
