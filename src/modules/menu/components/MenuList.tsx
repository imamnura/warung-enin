"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { formatCurrency } from "@/shared/utils/price";

type Menu = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  category: string;
  images: string[];
  isAvailable: boolean;
};

type MenuListProps = {
  menus: Menu[];
  onDelete: (id: string) => Promise<void>;
  onToggleAvailability: (id: string, isAvailable: boolean) => Promise<void>;
};

export function MenuList({
  menus,
  onDelete,
  onToggleAvailability,
}: MenuListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Predefined categories
  const categories = [
    { value: "ALL", label: "Semua Kategori" },
    { value: "NASI", label: "Makanan" },
    { value: "MINUMAN", label: "Minuman" },
    { value: "SNACK", label: "Snack" },
    { value: "BAKSO", label: "Bakso" },
    { value: "SOTO", label: "Soto" },
    { value: "AYAM", label: "Ayam" },
    { value: "MIE", label: "Mie" },
    { value: "LAUK", label: "Lauk" },
    { value: "OTHER", label: "Lainnya" },
  ];

  // Apply filters
  let filteredMenus = menus;

  if (searchQuery) {
    filteredMenus = filteredMenus.filter(
      (menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (categoryFilter !== "ALL") {
    filteredMenus = filteredMenus.filter(
      (menu) => menu.category === categoryFilter
    );
  }

  if (availabilityFilter !== "ALL") {
    filteredMenus = filteredMenus.filter((menu) =>
      availabilityFilter === "AVAILABLE" ? menu.isAvailable : !menu.isAvailable
    );
  }

  // Pagination
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMenus = filteredMenus.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, availabilityFilter]);

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      setDeletingId(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting menu:", error);
      alert("Gagal menghapus menu");
    }
  };

  const handleToggle = async (id: string, isAvailable: boolean) => {
    setTogglingId(id);
    try {
      await onToggleAvailability(id, isAvailable);
      router.refresh();
    } catch (error) {
      console.error("Error toggling availability:", error);
      alert("Gagal mengubah status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-6 space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Cari menu berdasarkan nama atau deskripsi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter - Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="ALL">Semua Status</option>
              <option value="AVAILABLE">Tersedia</option>
              <option value="UNAVAILABLE">Habis</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Menampilkan {filteredMenus.length} dari {menus.length} menu
        </p>
      </div>

      {/* Menu Grid */}
      {filteredMenus.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">
            {searchQuery ||
            categoryFilter !== "ALL" ||
            availabilityFilter !== "ALL"
              ? "Tidak ada menu yang sesuai dengan filter"
              : "Belum ada menu. Buat menu pertama Anda!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedMenus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-lg shadow-card overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {menu.images && menu.images.length > 0 ? (
                    <Image
                      src={menu.images[0]}
                      alt={menu.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {menu.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                          menu.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {menu.isAvailable ? "Tersedia" : "Habis"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {menu.description || "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{menu.category}</span>
                    <span className="font-semibold text-primary-600">
                      {formatCurrency(Number(menu.price))}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      className="flex-1 text-sm"
                      onClick={() => handleToggle(menu.id, menu.isAvailable)}
                      disabled={togglingId === menu.id}
                    >
                      {togglingId === menu.id
                        ? "..."
                        : menu.isAvailable
                        ? "Nonaktifkan"
                        : "Aktifkan"}
                    </Button>
                    <Link
                      href={`/dashboard/menu/${menu.id}/edit`}
                      className="flex-1"
                    >
                      <Button variant="ghost" className="w-full text-sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => setDeletingId(menu.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-card p-4 mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="text-sm"
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="text-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {deletingId && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeletingId(null)}
          onConfirm={() => handleDelete(deletingId)}
          title="Hapus Menu"
          message={`Apakah Anda yakin ingin menghapus menu "${
            menus.find((m) => m.id === deletingId)?.name
          }"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
        />
      )}
    </>
  );
}
