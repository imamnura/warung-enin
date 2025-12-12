"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";

interface AnalyticsFiltersProps {
  onFilterChange: (filters: { dateFrom: string; dateTo: string }) => void;
}

export function AnalyticsFilters({ onFilterChange }: AnalyticsFiltersProps) {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo);
  const [dateTo, setDateTo] = useState(today);

  const handleApply = () => {
    onFilterChange({ dateFrom, dateTo });
  };

  const setPreset = (days: number) => {
    const to = new Date().toISOString().split("T")[0];
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    setDateFrom(from);
    setDateTo(to);
    onFilterChange({ dateFrom: from, dateTo: to });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
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

        <div className="flex-1 min-w-[200px]">
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

        <div className="flex gap-2">
          <Button onClick={handleApply}>Terapkan</Button>
          <Button variant="outline" onClick={() => setPreset(7)}>
            7 Hari
          </Button>
          <Button variant="outline" onClick={() => setPreset(30)}>
            30 Hari
          </Button>
          <Button variant="outline" onClick={() => setPreset(90)}>
            90 Hari
          </Button>
        </div>
      </div>
    </div>
  );
}
