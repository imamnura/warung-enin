"use client";

import { useState } from "react";
import { toggleStoreStatus } from "../actions";
import { Badge } from "@/shared/ui/Badge";

export function StoreStatusToggle({ isOpen }: { isOpen: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!confirm(`Yakin ingin ${isOpen ? "menutup" : "membuka"} toko?`)) return;

    setLoading(true);
    const result = await toggleStoreStatus();
    alert(result.message);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">
          Status Toko:
        </span>
        {isOpen ? (
          <Badge color="success">🟢 Buka</Badge>
        ) : (
          <Badge color="destructive">🔴 Tutup</Badge>
        )}
      </div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {loading ? "..." : isOpen ? "Tutup Toko" : "Buka Toko"}
      </button>
    </div>
  );
}
