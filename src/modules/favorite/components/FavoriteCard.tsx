"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { formatPrice } from "@/shared/utils/price";
import { toggleFavorite } from "../actions";
import { useCartStore } from "@/modules/order/store";

type FavoriteCardProps = {
  userId: string;
  favorite: {
    id: string;
    menuId: string;
    menu: {
      id: string;
      name: string;
      description: string | null;
      price: number;
      category: string;
      images: string[];
      isAvailable: boolean;
      spicyLevel: number;
      prepTime: number | null;
      isPopular: boolean;
    };
  };
};

export function FavoriteCard({ userId, favorite }: FavoriteCardProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const result = await toggleFavorite(userId, favorite.menuId);
      if (result.success) {
        toast.success("Dihapus dari favorit");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menghapus");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = () => {
    if (!favorite.menu.isAvailable) {
      toast.error("Menu tidak tersedia");
      return;
    }

    addItem({
      menuId: favorite.menu.id,
      name: favorite.menu.name,
      price: favorite.menu.price,
      quantity: 1,
      image: favorite.menu.images[0],
    });

    toast.success(`${favorite.menu.name} ditambahkan ke keranjang`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/menu/${favorite.menu.id}`}>
        <div className="relative aspect-square">
          {favorite.menu.images[0] ? (
            <Image
              src={favorite.menu.images[0]}
              alt={favorite.menu.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
          {!favorite.menu.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge color="destructive" className="text-lg px-4 py-2">
                Tidak Tersedia
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/menu/${favorite.menu.id}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                {favorite.menu.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge color="primary">{favorite.menu.category}</Badge>
                {favorite.menu.isPopular && <Badge color="best">Popular</Badge>}
                {favorite.menu.spicyLevel > 0 && (
                  <Badge color="spicy">
                    {"🌶️".repeat(favorite.menu.spicyLevel)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {favorite.menu.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {favorite.menu.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            {favorite.menu.prepTime && (
              <span className="flex items-center gap-1">
                ⏱️ {favorite.menu.prepTime} menit
              </span>
            )}
          </div>

          <p className="text-2xl font-bold text-primary mb-3">
            {formatPrice(favorite.menu.price)}
          </p>
        </Link>

        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={!favorite.menu.isAvailable}
            className="flex-1"
          >
            {favorite.menu.isAvailable
              ? "Tambah ke Keranjang"
              : "Tidak Tersedia"}
          </Button>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Hapus dari favorit"
          >
            <span className="text-2xl">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
