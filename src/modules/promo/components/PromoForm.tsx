"use client";

import { useState } from "react";
import { createPromo } from "../actions";
import { Button } from "@/shared/ui/Button";

export function PromoForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoType, setPromoType] = useState<
    "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_DELIVERY"
  >("PERCENTAGE");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createPromo(formData);

    if (result.success) {
      alert(result.message);
      e.currentTarget.reset();
      onSuccess?.();
    } else {
      alert(result.message);
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Kode Promo *
          </label>
          <input
            type="text"
            name="code"
            required
            placeholder="DISKON50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent uppercase"
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">
            Huruf kapital, tanpa spasi
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Promo *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Diskon 50%"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            name="description"
            placeholder="Deskripsi promo..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipe Promo *
          </label>
          <select
            name="type"
            value={promoType}
            onChange={(e) =>
              setPromoType(
                e.target.value as
                  | "PERCENTAGE"
                  | "FIXED_AMOUNT"
                  | "FREE_DELIVERY"
              )
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="PERCENTAGE">Persentase (%)</option>
            <option value="FIXED_AMOUNT">Potongan Tetap (Rp)</option>
            <option value="FREE_DELIVERY">Gratis Ongkir</option>
          </select>
        </div>

        {promoType !== "FREE_DELIVERY" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {promoType === "PERCENTAGE"
                ? "Persentase Diskon *"
                : "Nominal Potongan *"}
            </label>
            <input
              type="number"
              name="value"
              required
              min={promoType === "PERCENTAGE" ? 1 : 1000}
              max={promoType === "PERCENTAGE" ? 100 : undefined}
              step={promoType === "PERCENTAGE" ? 1 : 1000}
              placeholder={promoType === "PERCENTAGE" ? "50" : "50000"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {promoType === "PERCENTAGE" && (
              <p className="text-xs text-gray-500 mt-1">1-100%</p>
            )}
          </div>
        )}

        {promoType === "FREE_DELIVERY" && (
          <input type="hidden" name="value" value="0" />
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Pembelian
          </label>
          <input
            type="number"
            name="minPurchase"
            min={0}
            step={1000}
            defaultValue={0}
            placeholder="50000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {promoType === "PERCENTAGE" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Maksimal Potongan (Opsional)
            </label>
            <input
              type="number"
              name="maxDiscount"
              min={0}
              step={1000}
              placeholder="100000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kosongkan jika tidak ada batas
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Kuota Total (Opsional)
          </label>
          <input
            type="number"
            name="usageLimit"
            min={1}
            placeholder="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Kosongkan jika unlimited</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Limit Per User *
          </label>
          <input
            type="number"
            name="perUserLimit"
            required
            min={1}
            defaultValue={1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tanggal Mulai *
          </label>
          <input
            type="datetime-local"
            name="startDate"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tanggal Berakhir *
          </label>
          <input
            type="datetime-local"
            name="endDate"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Promo"}
        </Button>
      </div>
    </form>
  );
}
