"use client";

import { useState } from "react";
import { deletePromo, togglePromoStatus } from "../actions";
import { Badge } from "@/shared/ui/Badge";

type Promo = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_DELIVERY";
  value: number;
  minPurchase: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
};

export function PromoList({ promos }: { promos: Promo[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleToggleStatus(id: string) {
    if (!confirm("Ubah status promo?")) return;
    setLoading(id);
    const result = await togglePromoStatus(id);
    alert(result.message);
    setLoading(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus promo ini? Tindakan tidak dapat dibatalkan.")) return;
    setLoading(id);
    const result = await deletePromo(id);
    alert(result.message);
    setLoading(null);
  }

  function getPromoTypeLabel(type: Promo["type"]) {
    switch (type) {
      case "PERCENTAGE":
        return "Persentase";
      case "FIXED_AMOUNT":
        return "Potongan Tetap";
      case "FREE_DELIVERY":
        return "Gratis Ongkir";
    }
  }

  function getPromoValue(promo: Promo) {
    if (promo.type === "FREE_DELIVERY") return "Gratis Ongkir";
    if (promo.type === "PERCENTAGE") return `${promo.value}%`;
    return `Rp ${promo.value.toLocaleString("id-ID")}`;
  }

  function isPromoActive(promo: Promo) {
    const now = new Date();
    return (
      promo.isActive &&
      now >= new Date(promo.startDate) &&
      now <= new Date(promo.endDate)
    );
  }

  if (promos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">Belum ada promo</p>
        <p className="text-gray-400 text-sm mt-2">Buat promo pertama Anda!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {promos.map((promo) => {
        const isActive = isPromoActive(promo);
        const isExpired = new Date() > new Date(promo.endDate);
        const usagePercentage = promo.usageLimit
          ? (promo.usageCount / promo.usageLimit) * 100
          : 0;

        return (
          <div
            key={promo.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-l-4 border-red-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-mono">
                  {promo.code}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{promo.name}</p>
              </div>
              <div className="flex gap-2">
                {isActive ? (
                  <Badge color="success">Aktif</Badge>
                ) : isExpired ? (
                  <Badge color="destructive">Kadaluarsa</Badge>
                ) : promo.isActive ? (
                  <Badge color="warning">Belum Mulai</Badge>
                ) : (
                  <Badge color="primary">Nonaktif</Badge>
                )}
              </div>
            </div>

            {promo.description && (
              <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipe:</span>
                <span className="font-semibold text-gray-900">
                  {getPromoTypeLabel(promo.type)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nilai:</span>
                <span className="font-semibold text-red-600">
                  {getPromoValue(promo)}
                </span>
              </div>
              {Number(promo.minPurchase) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Min. Belanja:</span>
                  <span className="font-semibold text-gray-900">
                    Rp {Number(promo.minPurchase).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              {promo.maxDiscount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Max. Potongan:</span>
                  <span className="font-semibold text-gray-900">
                    Rp {Number(promo.maxDiscount).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Periode:</span>
                <span className="text-gray-900 text-xs">
                  {new Date(promo.startDate).toLocaleDateString("id-ID")} -{" "}
                  {new Date(promo.endDate).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Penggunaan:</span>
                <span className="font-semibold text-gray-900">
                  {promo.usageCount}{" "}
                  {promo.usageLimit ? `/ ${promo.usageLimit}` : ""}
                </span>
              </div>
              {promo.usageLimit && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-600 to-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggleStatus(promo.id)}
                disabled={loading === promo.id}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
              >
                {loading === promo.id
                  ? "..."
                  : promo.isActive
                  ? "Nonaktifkan"
                  : "Aktifkan"}
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
                disabled={loading === promo.id}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
              >
                Hapus
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
