"use server";

import { prisma } from "@/lib/prisma";

export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  period?: "daily" | "weekly" | "monthly";
}

export async function getAdvancedAnalytics(filters: AnalyticsFilters = {}) {
  const { dateFrom, dateTo } = filters;

  const whereClause = {
    ...(dateFrom &&
      dateTo && {
        createdAt: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      }),
  };

  const [orders, payments, customers, menuItems] = await Promise.all([
    // Orders data
    prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        payment: true,
      },
    }),

    // Payments data
    prisma.payment.findMany({
      where: whereClause,
      select: {
        status: true,
        method: true,
        amount: true,
        createdAt: true,
      },
    }),

    // Customers data
    prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        ...whereClause,
      },
      include: {
        orders: true,
      },
    }),

    // Menu analytics
    prisma.orderItem.groupBy({
      by: ["menuId"],
      _sum: {
        quantity: true,
        subtotal: true,
      },
      _count: {
        id: true,
      },
    }),
  ]);

  // Revenue Analytics
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, order) => sum + Number(order.totalPrice), 0);

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;
  const cancelledOrders = orders.filter(
    (o) => o.status === "ORDERED" && !o.payment
  ).length;

  const averageOrderValue =
    completedOrders > 0 ? totalRevenue / completedOrders : 0;

  // Daily revenue trend
  const revenueByDate = orders.reduce((acc, order) => {
    if (order.status === "COMPLETED") {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += Number(order.totalPrice);
    }
    return acc;
  }, {} as Record<string, number>);

  const revenueTrend = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Order status breakdown
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Payment method breakdown
  const paymentsByMethod = payments.reduce((acc, payment) => {
    if (payment.status === "PAID") {
      acc[payment.method] = (acc[payment.method] || 0) + Number(payment.amount);
    }
    return acc;
  }, {} as Record<string, number>);

  // Delivery method breakdown
  const ordersByDelivery = orders.reduce((acc, order) => {
    acc[order.deliveryMethod] = (acc[order.deliveryMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top selling products
  const menuMap = new Map<string, { name: string; category: string }>();

  const menuDetails = await prisma.menu.findMany({
    select: {
      id: true,
      name: true,
      category: true,
    },
  });

  menuDetails.forEach((menu) => {
    menuMap.set(menu.id, { name: menu.name, category: menu.category });
  });

  const topProducts = menuItems
    .map((item) => {
      const menu = menuMap.get(item.menuId);
      return {
        menuId: item.menuId,
        name: menu?.name || "Unknown",
        category: menu?.category || "OTHER",
        quantity: item._sum.quantity || 0,
        revenue: Number(item._sum.subtotal || 0),
        orders: item._count.id,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Category performance
  const categoryPerformance = topProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { revenue: 0, quantity: 0, orders: 0 };
    }
    acc[product.category].revenue += product.revenue;
    acc[product.category].quantity += product.quantity;
    acc[product.category].orders += product.orders;
    return acc;
  }, {} as Record<string, { revenue: number; quantity: number; orders: number }>);

  // Customer insights
  const newCustomers = customers.filter(
    (c) =>
      dateFrom &&
      dateTo &&
      new Date(c.createdAt) >= new Date(dateFrom) &&
      new Date(c.createdAt) <= new Date(dateTo)
  ).length;

  const activeCustomers = customers.filter((c) => c.orders.length > 0).length;

  const customersWithSpending = customers.map((customer) => {
    const totalSpent = customer.orders
      .filter((o) => o.status === "COMPLETED")
      .reduce((sum, order) => sum + Number(order.totalPrice), 0);
    return { ...customer, totalSpent };
  });

  const topCustomers = customersWithSpending
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10)
    .map((c) => ({
      id: c.id,
      name: c.name,
      totalSpent: c.totalSpent,
      orderCount: c.orders.length,
    }));

  // Peak hours analysis
  const ordersByHour = orders.reduce((acc, order) => {
    const hour = new Date(order.createdAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const peakHours = Object.entries(ordersByHour)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count);

  return {
    summary: {
      totalRevenue,
      totalOrders,
      completedOrders,
      cancelledOrders,
      averageOrderValue,
      newCustomers,
      activeCustomers,
    },
    trends: {
      revenue: revenueTrend,
      ordersByStatus,
      paymentsByMethod,
      ordersByDelivery,
    },
    products: {
      topProducts,
      categoryPerformance,
    },
    customers: {
      topCustomers,
      newCustomers,
      activeCustomers,
    },
    insights: {
      peakHours: peakHours.slice(0, 5),
    },
  };
}

export async function exportAnalyticsToCSV(filters: AnalyticsFilters = {}) {
  const analytics = await getAdvancedAnalytics(filters);

  // Summary CSV
  const summaryCSV = [
    "Metrik,Nilai",
    `Total Revenue,${analytics.summary.totalRevenue}`,
    `Total Orders,${analytics.summary.totalOrders}`,
    `Completed Orders,${analytics.summary.completedOrders}`,
    `Cancelled Orders,${analytics.summary.cancelledOrders}`,
    `Average Order Value,${analytics.summary.averageOrderValue}`,
    `New Customers,${analytics.summary.newCustomers}`,
    `Active Customers,${analytics.summary.activeCustomers}`,
  ].join("\n");

  // Top Products CSV
  const productsHeader =
    "Nama Menu,Kategori,Jumlah Terjual,Revenue,Total Order";
  const productsRows = analytics.products.topProducts
    .map(
      (p) => `"${p.name}",${p.category},${p.quantity},${p.revenue},${p.orders}`
    )
    .join("\n");
  const productsCSV = `${productsHeader}\n${productsRows}`;

  // Top Customers CSV
  const customersHeader = "Nama Customer,Total Belanja,Jumlah Order";
  const customersRows = analytics.customers.topCustomers
    .map((c) => `"${c.name}",${c.totalSpent},${c.orderCount}`)
    .join("\n");
  const customersCSV = `${customersHeader}\n${customersRows}`;

  return {
    summary: summaryCSV,
    products: productsCSV,
    customers: customersCSV,
  };
}
