"use client";

import { useCartStore } from "@/modules/order/store";
import { formatPrice } from "@/shared/utils/price";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export function CartSidebar({ onCheckout }: { onCheckout: () => void }) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();

  const total = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Keranjang</h2>
          <div className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-semibold">
            0 item
          </div>
        </div>
        <div className="text-center py-12">
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Keranjang masih kosong</p>
          <p className="text-gray-400 text-sm mt-2">
            Tambahkan menu favoritmu sekarang!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          Keranjang
        </h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md"
        >
          {totalItems} item
        </motion.div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto mb-6 pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.menuId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              {item.image && (
                <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-900 truncate mb-1">
                  {item.name}
                </h3>
                <p className="text-primary font-bold text-sm mb-2">
                  {formatPrice(item.price)}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        updateQuantity(item.menuId, item.quantity - 1)
                      }
                      className="w-7 h-7 rounded-l-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3 text-gray-700" />
                    </motion.button>
                    <span className="text-sm font-bold text-gray-900 min-w-[1.5rem] text-center">
                      {item.quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        updateQuantity(item.menuId, item.quantity + 1)
                      }
                      className="w-7 h-7 rounded-r-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3 text-gray-700" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      removeItem(item.menuId);
                      toast.success("Item dihapus dari keranjang");
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="border-t-2 border-gray-200 pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Subtotal</span>
          <span className="text-gray-900 font-semibold">
            {formatPrice(total)}
          </span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {formatPrice(total)}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Checkout Sekarang
        </motion.button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </motion.div>
  );
}
