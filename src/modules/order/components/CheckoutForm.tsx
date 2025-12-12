"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/modules/order/store";
import { createOrder } from "@/modules/order/actions";
import { validatePromoCode } from "@/modules/promo/actions";
import { Button } from "@/shared/ui/Button";
import { toast } from "sonner";
import { formatPrice } from "@/shared/utils/price";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nama minimal 3 karakter"),
  customerPhone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^[0-9+]+$/, "Nomor telepon hanya boleh angka"),
  customerEmail: z
    .string()
    .email("Email tidak valid")
    .optional()
    .or(z.literal("")),
  deliveryMethod: z.enum(["DIANTAR", "AMBIL_SENDIRI"]),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    name: string;
    type: string;
    discount: number;
  } | null>(null);
  const { items, clearCart, getTotalPrice } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: "AMBIL_SENDIRI",
    },
  });

  const deliveryMethod = watch("deliveryMethod");
  const subtotal = getTotalPrice();
  const deliveryFee = deliveryMethod === "DIANTAR" ? 10000 : 0;
  const discount = appliedPromo?.discount || 0;
  const freeDelivery = appliedPromo?.type === "FREE_DELIVERY";
  const finalDeliveryFee = freeDelivery ? 0 : deliveryFee;
  const total = subtotal + finalDeliveryFee - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Masukkan kode promo");
      return;
    }

    setIsValidatingPromo(true);
    try {
      const result = await validatePromoCode(promoCode, subtotal);

      if (result.valid && result.promo) {
        setAppliedPromo(result.promo);
        toast.success(result.message || "Promo berhasil diterapkan!");
      } else {
        toast.error(result.message || "Kode promo tidak valid");
        setAppliedPromo(null);
      }
    } catch (error) {
      console.error("Error validating promo:", error);
      toast.error("Gagal memvalidasi kode promo");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast.success("Promo dihapus");
  };

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
        promoCode: appliedPromo?.code || undefined,
        items: items.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          notes: item.notes || undefined,
        })),
      });

      if (result) {
        toast.success("Pesanan berhasil dibuat!");
        clearCart();
        router.push(`/track?order=${result.orderNumber}`);
      } else {
        toast.error("Gagal membuat pesanan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Informasi Pelanggan</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              {...register("customerName")}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan nama lengkap"
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              {...register("customerPhone")}
              type="tel"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="08123456789"
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
              {...register("customerEmail")}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

      <div>
        <h3 className="text-xl font-bold mb-4">Metode Pengiriman</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="relative">
            <input
              {...register("deliveryMethod")}
              type="radio"
              value="AMBIL_SENDIRI"
              className="peer sr-only"
            />
            <div className="cursor-pointer rounded-lg border-2 border-gray-200 p-4 text-center hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5">
              <div className="text-2xl mb-2">🛍️</div>
              <div className="font-medium">Ambil Sendiri</div>
            </div>
          </label>

          <label className="relative">
            <input
              {...register("deliveryMethod")}
              type="radio"
              value="DIANTAR"
              className="peer sr-only"
            />
            <div className="cursor-pointer rounded-lg border-2 border-gray-200 p-4 text-center hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5">
              <div className="text-2xl mb-2">🚚</div>
              <div className="font-medium">Diantar</div>
            </div>
          </label>
        </div>
      </div>

      {deliveryMethod === "DIANTAR" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Alamat Pengiriman <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("address")}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan alamat lengkap"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          Catatan (Opsional)
        </label>
        <textarea
          {...register("notes")}
          rows={2}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Tambahkan catatan untuk pesanan"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3">Kode Promo</h3>
        {appliedPromo ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-green-800">{appliedPromo.code}</p>
                <p className="text-sm text-green-600">{appliedPromo.name}</p>
                {appliedPromo.type === "FREE_DELIVERY" ? (
                  <p className="text-xs text-green-600 mt-1">
                    🎁 Gratis Ongkir
                  </p>
                ) : (
                  <p className="text-xs text-green-600 mt-1">
                    💰 Hemat {formatPrice(appliedPromo.discount)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="text-red-500 hover:text-red-700 font-semibold text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Masukkan kode promo"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              disabled={isValidatingPromo}
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={isValidatingPromo || !promoCode.trim()}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidatingPromo ? "..." : "Pakai"}
            </button>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between">
              <span>Ongkir</span>
              <span
                className={freeDelivery ? "line-through text-gray-400" : ""}
              >
                {formatPrice(deliveryFee)}
              </span>
            </div>
          )}
          {freeDelivery && deliveryFee > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Gratis Ongkir</span>
              <span>-{formatPrice(deliveryFee)}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Diskon Promo</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Kembali
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Buat Pesanan"}
          </Button>
        </div>
      </div>
    </form>
  );
}
