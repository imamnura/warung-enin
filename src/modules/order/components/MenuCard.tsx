"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/shared/ui/Badge";
import { useCartStore } from "@/modules/order/store";
import { FavoriteButton } from "@/modules/favorite/components/FavoriteButton";
import { toast } from "sonner";
import { formatPrice } from "@/shared/utils/price";
import { Plus, Minus, ShoppingCart, Clock, Flame } from "lucide-react";

type MenuCardProps = {
  menu: {
    id: string;
    name: string;
    description: string;
    price: number | { toString(): string };
    images: string[];
    isPopular: boolean;
    isAvailable: boolean;
    spicyLevel: number | null;
    prepTime: number | null;
  };
  userId?: string | null;
  isFavorite?: boolean;
};

export function MenuCard({ menu, userId, isFavorite = false }: MenuCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      menuId: menu.id,
      name: menu.name,
      price: Number(menu.price),
      quantity,
      image: menu.images[0],
    });
    toast.success(`${menu.name} ditambahkan ke keranjang`);
    setQuantity(1);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all border border-gray-100"
    >
      <Link href={`/menu/${menu.id}`}>
        <div className="relative h-56 w-full group overflow-hidden">
          {menu.images[0] ? (
            <Image
              src={menu.images[0]}
              alt={menu.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-gray-300" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges & Favorite */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              {menu.isPopular && (
                <Badge
                  color="warning"
                  className="shadow-lg backdrop-blur-sm bg-yellow-500/90"
                >
                  ⭐ Populer
                </Badge>
              )}
              {menu.spicyLevel && menu.spicyLevel > 0 && (
                <Badge
                  color="destructive"
                  className="shadow-lg backdrop-blur-sm bg-red-500/90 flex items-center gap-1"
                >
                  <Flame className="w-3 h-3" />
                  Level {menu.spicyLevel}
                </Badge>
              )}
            </div>
            <div className="z-10">
              <FavoriteButton
                userId={userId || null}
                menuId={menu.id}
                initialIsFavorite={isFavorite}
                variant="icon"
              />
            </div>
          </div>

          {!menu.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center">
              <Badge color="destructive" className="text-lg px-4 py-2">
                Tidak Tersedia
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-3">
          <Link href={`/menu/${menu.id}`}>
            <h3 className="font-bold text-lg text-gray-900 hover:text-primary transition-colors line-clamp-1">
              {menu.name}
            </h3>
          </Link>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {menu.description}
        </p>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {formatPrice(Number(menu.price))}
            </span>
          </div>
          {menu.prepTime && (
            <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{menu.prepTime} min</span>
            </div>
          )}
        </div>

        {menu.isAvailable ? (
          <div className="space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-700" />
              </motion.button>
              <span className="text-xl font-bold text-gray-900 min-w-[3rem] text-center">
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-700" />
              </motion.button>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Tambah ke Keranjang
            </motion.button>
          </div>
        ) : (
          <div className="bg-gray-100 text-gray-500 text-center py-3 rounded-xl font-medium">
            Stok Habis
          </div>
        )}
      </div>
    </motion.div>
  );
}
