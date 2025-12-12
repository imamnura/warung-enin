"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface CustomerFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => void;
}

export function CustomerFilters({ onFilterChange }: CustomerFiltersProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search - auto trigger after 500ms
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onFilterChange({ search });
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, onFilterChange]);

  // Auto trigger on sort change
  const handleSortByChange = (value: string) => {
    setSortBy(value);
    onFilterChange({ sortBy: value, sortOrder });
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
    onFilterChange({ sortBy, sortOrder: value });
  };

  const handleReset = () => {
    setSearch("");
    setSortBy("name");
    setSortOrder("asc");
    onFilterChange({ search: "", sortBy: "name", sortOrder: "asc" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cari Customer
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nama, email, atau telepon..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Urutkan Berdasarkan
          </label>
          <select
            value={sortBy}
            onChange={(e) => handleSortByChange(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
          >
            <option value="name">Nama</option>
            <option value="orders">Jumlah Order</option>
            <option value="totalSpent">Total Belanja</option>
            <option value="lastOrder">Order Terakhir</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Urutan
          </label>
          <select
            value={sortOrder}
            onChange={(e) => handleSortOrderChange(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
          >
            <option value="asc">A-Z / Terkecil</option>
            <option value="desc">Z-A / Terbesar</option>
          </select>
        </div>
      </div>

      {(search || sortBy !== "name" || sortOrder !== "asc") && (
        <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <span className="text-sm text-gray-600">Filter aktif</span>
          <button
            onClick={handleReset}
            className="text-sm text-primary hover:text-secondary font-medium transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
}
