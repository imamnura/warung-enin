"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { CourierCard } from "./CourierCard";
import { CourierFilters } from "./CourierFilters";
import { CourierStats } from "./CourierStats";
import { CourierModal } from "./CourierModal";
import { deleteCourier, toggleCourierStatus } from "../actions";

interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: string | null;
  vehicleNumber: string | null;
  address: string | null;
  idCard: string | null;
  isActive: boolean;
  _count?: {
    orders: number;
  };
}

interface CourierClientProps {
  initialCouriers: Courier[];
  stats: {
    totalCouriers: number;
    activeCouriers: number;
    busyCouriers: number;
    totalDeliveries: number;
  };
}

export function CourierClient({ initialCouriers, stats }: CourierClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(initialCouriers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCouriers = initialCouriers.slice(startIndex, endIndex);

  const updateFilters = useCallback(
    (filters: { search?: string; status?: string; sortBy?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (filters.search) {
        params.set("search", filters.search);
      } else {
        params.delete("search");
      }

      if (filters.status && filters.status !== "all") {
        params.set("status", filters.status);
      } else {
        params.delete("status");
      }

      if (filters.sortBy && filters.sortBy !== "name") {
        params.set("sortBy", filters.sortBy);
      } else {
        params.delete("sortBy");
      }

      router.push(`/dashboard/couriers?${params.toString()}`);
      setCurrentPage(1);
    },
    [router, searchParams]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddCourier = () => {
    setSelectedCourier(null);
    setIsModalOpen(true);
  };

  const handleEditCourier = (courier: Courier) => {
    setSelectedCourier(courier);
    setIsModalOpen(true);
  };

  const handleDeleteCourier = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kurir ini?")) return;

    const result = await deleteCourier(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const result = await toggleCourierStatus(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleModalSuccess = () => {
    router.refresh();
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div>
      {/* Stats */}
      <CourierStats {...stats} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Daftar Kurir</h2>
          <p className="text-slate-600 mt-1">
            {startIndex + 1} - {Math.min(endIndex, initialCouriers.length)} dari{" "}
            {initialCouriers.length} kurir
          </p>
        </div>
        <Button onClick={handleAddCourier}>
          <Plus className="w-5 h-5 mr-2" />
          Tambah Kurir
        </Button>
      </div>

      {/* Filters */}
      <CourierFilters
        onFilterChange={updateFilters}
        initialFilters={{
          search: searchParams.get("search") || "",
          status: searchParams.get("status") || "all",
          sortBy: searchParams.get("sortBy") || "name",
        }}
      />

      {/* Courier Grid */}
      {currentCouriers.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200">
          <p className="text-slate-600 text-lg">Tidak ada kurir ditemukan</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence mode="popLayout">
              {currentCouriers.map((courier) => (
                <CourierCard
                  key={courier.id}
                  courier={courier}
                  onEdit={handleEditCourier}
                  onDelete={handleDeleteCourier}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <CourierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courier={selectedCourier}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
