"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomerFilters } from "@/modules/customer/components/CustomerFilters";
import { CustomerCard } from "@/modules/customer/components/CustomerCard";
import { CustomerStats } from "@/modules/customer/components/CustomerStats";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomersClientProps {
  initialCustomers: Array<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: Date;
    ordersCount: number;
    totalSpent: number;
    lastOrderDate: Date | null;
  }>;
  stats: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    totalOrders: number;
  };
}

export function CustomersClient({
  initialCustomers,
  stats,
}: CustomersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Calculate pagination
  const totalPages = Math.ceil(initialCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = initialCustomers.slice(startIndex, endIndex);

  // Auto-update filters (no apply button needed)
  const updateFilters = useCallback(
    (filters: { search?: string; sortBy?: string; sortOrder?: string }) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (filters.search !== undefined) {
          if (filters.search) {
            params.set("search", filters.search);
          } else {
            params.delete("search");
          }
        }

        if (filters.sortBy) params.set("sortBy", filters.sortBy);
        if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

        router.push(`/dashboard/customers?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Customer
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola dan pantau data customer Warung Enin
          </p>
        </div>
      </div>

      <CustomerStats stats={stats} />

      <CustomerFilters onFilterChange={updateFilters} />

      {isPending ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      ) : initialCustomers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-xl text-gray-600 mb-2">Tidak ada customer</p>
          <p className="text-gray-500">
            Belum ada customer yang terdaftar di sistem
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {startIndex + 1} -{" "}
                  {Math.min(endIndex, initialCustomers.length)} dari{" "}
                  {initialCustomers.length} customer
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show first, last, current, and adjacent pages
                        if (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg border transition-colors ${
                                currentPage === page
                                  ? "bg-primary text-white border-primary"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 py-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
