"use server";

import { prisma } from "@/lib/prisma";

export interface CourierFilters {
  search?: string;
  status?: "all" | "active" | "inactive";
  sortBy?: "name" | "orders" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export async function getCouriers(filters: CourierFilters = {}) {
  const {
    search,
    status = "all",
    sortBy = "name",
    sortOrder = "asc",
  } = filters;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } },
        { vehicleNumber: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(status !== "all" && {
      isActive: status === "active",
    }),
  };

  const couriers = await prisma.courier.findMany({
    where,
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
      orders: {
        where: {
          status: "COMPLETED",
        },
        select: {
          id: true,
        },
      },
    },
    orderBy:
      sortBy === "orders"
        ? undefined
        : sortBy === "name"
        ? { name: sortOrder }
        : { createdAt: sortOrder },
  });

  const couriersWithStats = couriers.map((courier) => ({
    ...courier,
    totalOrders: courier._count.orders,
    completedOrders: courier.orders.length,
  }));

  if (sortBy === "orders") {
    couriersWithStats.sort((a, b) => {
      const comparison = a.totalOrders - b.totalOrders;
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }

  return couriersWithStats;
}

export async function getCourierById(id: string) {
  const courier = await prisma.courier.findUnique({
    where: { id },
    include: {
      orders: {
        include: {
          customer: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  if (!courier) return null;

  const completedOrders = courier.orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  const ordersWithNumbers = courier.orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    discount: Number(order.discount),
    totalPrice: Number(order.totalPrice),
  }));

  return {
    ...courier,
    orders: ordersWithNumbers,
    totalOrders: courier._count.orders,
    completedOrders,
  };
}

export async function getCourierStats() {
  const totalCouriers = await prisma.courier.count();
  const activeCouriers = await prisma.courier.count({
    where: { isActive: true },
  });

  const couriersWithOrders = await prisma.courier.findMany({
    include: {
      orders: {
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  const busyCouriers = couriersWithOrders.filter(
    (c) => c.orders.length > 0
  ).length;

  const totalDeliveries = await prisma.order.count({
    where: {
      courierId: { not: null },
      status: "COMPLETED",
    },
  });

  return {
    totalCouriers,
    activeCouriers,
    busyCouriers,
    totalDeliveries,
  };
}
