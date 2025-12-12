"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleFavorite } from "../actions";

type FavoriteButtonProps = {
  userId: string | null;
  menuId: string;
  initialIsFavorite: boolean;
  variant?: "icon" | "full";
};

export function FavoriteButton({
  userId,
  menuId,
  initialIsFavorite,
  variant = "icon",
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/auth/login?callbackUrl=/reservation");
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleFavorite(userId, menuId);

      if (result.success) {
        setIsFavorite(result.isFavorite || false);
        toast.success(
          result.isFavorite ? "Ditambahkan ke favorit" : "Dihapus dari favorit"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all disabled:opacity-50"
        title={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
      >
        <span className="text-2xl">{isFavorite ? "❤️" : "🤍"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
    >
      <span className="text-xl">{isFavorite ? "❤️" : "🤍"}</span>
      <span className="font-medium">
        {isFavorite ? "Favorit" : "Tambah ke Favorit"}
      </span>
    </button>
  );
}
