"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        menu: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert Decimal to number
    return favorites.map((fav) => ({
      ...fav,
      menu: {
        ...fav.menu,
        price: Number(fav.menu.price),
      },
    }));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

export async function isFavorite(userId: string, menuId: string) {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_menuId: {
          userId,
          menuId,
        },
      },
    });

    return !!favorite;
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
}

export async function toggleFavorite(userId: string, menuId: string) {
  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_menuId: {
          userId,
          menuId,
        },
      },
    });

    if (existing) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: { id: existing.id },
      });

      revalidatePath("/profile/favorites");
      revalidatePath("/reservation");
      return { success: true, isFavorite: false };
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId,
          menuId,
        },
      });

      revalidatePath("/profile/favorites");
      revalidatePath("/reservation");
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Gagal mengubah favorit" };
  }
}

export async function getFavoritesCount(userId: string) {
  try {
    const count = await prisma.favorite.count({
      where: { userId },
    });

    return count;
  } catch (error) {
    console.error("Error counting favorites:", error);
    return 0;
  }
}
