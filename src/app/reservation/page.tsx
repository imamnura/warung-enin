"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MenuCard } from "@/modules/order/components/MenuCard";
import { CartSidebar } from "@/modules/order/components/CartSidebar";
import { CheckoutModal } from "@/modules/order/components/CheckoutModal";
import { Container } from "@/shared/ui/Container";
import { useCartStore } from "@/modules/order/store";
import { motion } from "framer-motion";
import { Search, Package, TrendingUp, Star } from "lucide-react";
import { formatPrice } from "@/shared/utils/price";

type Menu = {
  id: string;
  name: string;
  description: string;
  price: number | { toString(): string };
  category: string;
  images: string[];
  isPopular: boolean;
  isAvailable: boolean;
  spicyLevel: number | null;
  prepTime: number | null;
};

type FilterType = "ALL" | "POPULAR" | "BEST_SELLER";

export default function ReservationPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    // Get user session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user?.id) {
          setUserId(session.user.id);
          // Fetch favorites
          fetch(`/api/favorites?userId=${session.user.id}`)
            .then((res) => res.json())
            .then((data: { menuId: string }[]) => {
              setFavorites(new Set(data.map((f) => f.menuId)));
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const response = await fetch("/api/menus");
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenus();
  }, []);

  const categories = [
    { value: "ALL", label: "Semua Kategori" },
    { value: "NASI", label: "Makanan" },
    { value: "MINUMAN", label: "Minuman" },
    { value: "SNACK", label: "Snack" },
    { value: "DESSERT", label: "Dessert" },
  ];

  // Apply filters
  let filteredMenus = menus;

  // Filter by category
  if (selectedCategory !== "ALL") {
    filteredMenus = filteredMenus.filter(
      (m) => m.category === selectedCategory
    );
  }

  // Filter by type
  if (selectedFilter === "POPULAR") {
    filteredMenus = filteredMenus.filter((m) => m.isPopular);
  } else if (selectedFilter === "BEST_SELLER") {
    // For now, use popular as best seller (can be updated with sales data later)
    filteredMenus = filteredMenus.filter((m) => m.isPopular);
  }

  // Filter by search query
  if (searchQuery) {
    filteredMenus = filteredMenus.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary py-16 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              Selamat Datang di Warung Enin
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Nikmati hidangan lezat dengan harga terjangkau. Pesan sekarang dan
              rasakan kenikmatan kuliner!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="#menu">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  Lihat Menu
                </motion.button>
              </Link>

              <Link href="/track">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Lacak Pesanan
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8" id="menu">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Enhanced Search & Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              {/* Search Bar with Icon */}
              <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari menu favorit kamu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Type Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filter
                  </label>
                  <select
                    value={selectedFilter}
                    onChange={(e) =>
                      setSelectedFilter(e.target.value as FilterType)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                  >
                    <option value="ALL">Semua Menu</option>
                    <option value="POPULAR">⭐ Menu Populer</option>
                    <option value="BEST_SELLER">🔥 Menu Terlaris</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedCategory !== "ALL" ||
                selectedFilter !== "ALL" ||
                searchQuery) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Filter aktif:
                  </span>
                  {selectedCategory !== "ALL" && (
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                      {
                        categories.find((c) => c.value === selectedCategory)
                          ?.label
                      }
                    </span>
                  )}
                  {selectedFilter !== "ALL" && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {selectedFilter === "POPULAR" ? "Populer" : "Terlaris"}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      &quot;{searchQuery}&quot;
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCategory("ALL");
                      setSelectedFilter("ALL");
                      setSearchQuery("");
                    }}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-full text-sm font-medium transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </motion.div>

            {/* Menu List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6 mb-20 lg:mb-0"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {selectedFilter === "POPULAR" && (
                      <Star className="w-7 h-7 text-yellow-500" />
                    )}
                    {selectedFilter === "BEST_SELLER" && (
                      <TrendingUp className="w-7 h-7 text-red-500" />
                    )}
                    {selectedFilter === "POPULAR"
                      ? "Menu Populer"
                      : selectedFilter === "BEST_SELLER"
                      ? "Menu Terlaris"
                      : selectedCategory === "ALL"
                      ? "Semua Menu"
                      : categories.find((c) => c.value === selectedCategory)
                          ?.label || selectedCategory}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredMenus.length} menu tersedia
                  </p>
                </div>
              </div>

              {filteredMenus.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white rounded-2xl shadow-md"
                >
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    {searchQuery
                      ? `Tidak ada menu yang sesuai dengan "${searchQuery}"`
                      : "Tidak ada menu tersedia"}
                  </p>
                  <p className="text-gray-400 mt-2">
                    Coba ubah filter atau kata kunci pencarian
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredMenus.map((menu, index) => (
                    <motion.div
                      key={menu.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MenuCard
                        menu={menu}
                        userId={userId}
                        isFavorite={favorites.has(menu.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <CartSidebar onCheckout={() => setShowCheckout(true)} />
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Checkout Button */}
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 lg:hidden z-40"
          >
            <div className="bg-gradient-to-t from-black/10 to-transparent p-4 pb-safe">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCheckout(true)}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-between px-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                    {totalItems}
                  </div>
                  <span>Item</span>
                </div>
                <span className="text-lg">Checkout</span>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                  {formatPrice(useCartStore.getState().getTotalPrice())}
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </Container>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </div>
  );
}
