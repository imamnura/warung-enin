import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/enums";

export async function getDashboardAnalytics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Parallel queries for better performance
  const [
    todayOrders,
    totalRevenue,
    totalMenus,
    popularMenus,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    // Today's orders count
    prisma.order.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),

    // Today's revenue
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: [OrderStatus.COMPLETED],
        },
      },
      _sum: {
        totalPrice: true,
      },
    }),

    // Total menus
    prisma.menu.count(),

    // Popular menus (top 5)
    prisma.menu.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        orderCount: "desc",
      },
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        orderCount: true,
        images: true,
      },
    }),

    // Recent orders (last 10)
    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        items: {
          include: {
            menu: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),

    // Orders by status (for chart)
    prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    }),
  ]);

  // Format data
  const revenue = totalRevenue._sum.totalPrice
    ? Number(totalRevenue._sum.totalPrice)
    : 0;

  const popular = popularMenus.map((menu) => ({
    ...menu,
    price: Number(menu.price),
  }));

  const recent = recentOrders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    discount: Number(order.discount),
    totalPrice: Number(order.totalPrice),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
    })),
  }));

  const statusChart = ordersByStatus.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));

  return {
    metrics: {
      todayOrders,
      todayRevenue: revenue,
      totalMenus,
      pendingOrders:
        ordersByStatus.find((s) => s.status === OrderStatus.ORDERED)?._count
          .id || 0,
    },
    popularMenus: popular,
    recentOrders: recent,
    ordersByStatus: statusChart,
  };
}
