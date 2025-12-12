"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/ui/Button";

interface PaymentFiltersProps {
  onFilterChange: (filters: {
    status: string;
    method: string;
    dateFrom: string;
    dateTo: string;
    search: string;
  }) => void;
}

export function PaymentFilters({ onFilterChange }: PaymentFiltersProps) {
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-fetch with debounce for search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      onFilterChange({ status, method, dateFrom, dateTo, search });
    }, 500);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, status, method, dateFrom, dateTo, onFilterChange]);

  const handleReset = () => {
    setStatus("");
    setMethod("");
    setDateFrom("");
    setDateTo("");
    setSearch("");
    onFilterChange({
      status: "",
      method: "",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Lunas</option>
            <option value="FAILED">Gagal</option>
            <option value="REFUNDED">Refund</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Metode
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Semua Metode</option>
            <option value="CASH">Cash</option>
            <option value="QRIS">QRIS</option>
            <option value="GOPAY">GoPay</option>
            <option value="SHOPEEPAY">ShopeePay</option>
            <option value="OVO">OVO</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cari
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order, customer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={handleReset}>
          Reset Filter
        </Button>
      </div>
    </div>
  );
}
