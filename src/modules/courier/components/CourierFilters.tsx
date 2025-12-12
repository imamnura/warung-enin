"use client";

import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface CourierFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    status?: string;
    sortBy?: string;
  }) => void;
  initialFilters?: {
    search?: string;
    status?: string;
    sortBy?: string;
  };
}

export function CourierFilters({
  onFilterChange,
  initialFilters = {},
}: CourierFiltersProps) {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState(initialFilters.status || "all");
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || "name");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onFilterChange({ search, status, sortBy });
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, status, sortBy, onFilterChange]);

  // Auto-trigger on status change
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    onFilterChange({ search, status: newStatus, sortBy });
  };

  // Auto-trigger on sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    onFilterChange({ search, status, sortBy: newSort });
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("name");
    onFilterChange({});
  };

  const hasActiveFilters = search || status !== "all" || sortBy !== "name";

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          Filter & Pencarian
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kurir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
        >
          <option value="name">Urutkan: Nama</option>
          <option value="orders">Urutkan: Total Pengiriman</option>
          <option value="createdAt">Urutkan: Terbaru</option>
        </select>
      </div>
    </div>
  );
}
