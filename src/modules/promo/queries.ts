import { prisma } from "@/lib/prisma";

export async function getPromos() {
  const promos = await prisma.promo.findMany({
    orderBy: { createdAt: "desc" },
  });

  return promos.map((promo) => ({
    ...promo,
    value: Number(promo.value),
    minPurchase: Number(promo.minPurchase),
    maxDiscount: promo.maxDiscount ? Number(promo.maxDiscount) : null,
  }));
}

export async function getActivePromos() {
  const now = new Date();

  const promos = await prisma.promo.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { createdAt: "desc" },
  });

  return promos.map((promo) => ({
    ...promo,
    value: Number(promo.value),
    minPurchase: Number(promo.minPurchase),
    maxDiscount: promo.maxDiscount ? Number(promo.maxDiscount) : null,
  }));
}

export async function getPromoById(id: string) {
  const promo = await prisma.promo.findUnique({
    where: { id },
  });

  if (!promo) return null;

  return {
    ...promo,
    value: Number(promo.value),
    minPurchase: Number(promo.minPurchase),
    maxDiscount: promo.maxDiscount ? Number(promo.maxDiscount) : null,
  };
}
