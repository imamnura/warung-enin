import { prisma } from "@/lib/prisma";
import { MenuCategory } from "@/generated/prisma/enums";

export async function getMenus() {
  return prisma.menu.findMany({
    orderBy: { createdAt: "asc" },
    where: { isAvailable: true },
  });
}

export async function getMenuById(id: string) {
  return prisma.menu.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getMenusByCategory(category: MenuCategory) {
  return prisma.menu.findMany({
    where: {
      category,
      isAvailable: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPopularMenus(limit: number = 10) {
  return prisma.menu.findMany({
    where: { isAvailable: true },
    orderBy: { orderCount: "desc" },
    take: limit,
  });
}
