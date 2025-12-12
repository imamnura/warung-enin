"use server";

import { prisma } from "@/lib/prisma";

export interface CustomerFilters {
  search?: string;
  sortBy?: "name" | "orders" | "totalSpent" | "lastOrder";
  sortOrder?: "asc" | "desc";
}

export async function getCustomers(filters: CustomerFilters = {}) {
  const { search, sortBy = "name", sortOrder = "asc" } = filters;

  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      orders: {
        include: {
          items: true,
        },
      },
      addresses: true,
      reviews: true,
      favorites: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          favorites: true,
        },
      },
    },
  });

  // Calculate total spent for each customer
  const customersWithStats = customers.map((customer) => {
    const totalSpent = customer.orders.reduce((sum, order) => {
      return sum + Number(order.totalPrice);
    }, 0);

    const lastOrder =
      customer.orders.length > 0
        ? customer.orders.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )[0]
        : null;

    // Convert Decimal fields in orders
    const ordersWithNumbers = customer.orders.map((order) => ({
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

    return {
      ...customer,
      orders: ordersWithNumbers,
      totalSpent,
      lastOrderDate: lastOrder?.createdAt ?? null,
      ordersCount: customer.orders.length,
    };
  });

  // Sort customers
  customersWithStats.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "orders":
        comparison = a.ordersCount - b.ordersCount;
        break;
      case "totalSpent":
        comparison = a.totalSpent - b.totalSpent;
        break;
      case "lastOrder":
        const aDate = a.lastOrderDate?.getTime() ?? 0;
        const bDate = b.lastOrderDate?.getTime() ?? 0;
        comparison = aDate - bDate;
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return customersWithStats;
}

export async function getCustomerById(id: string) {
  const customer = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
    include: {
      orders: {
        include: {
          items: {
            include: {
              menu: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      addresses: true,
      reviews: {
        include: {
          menu: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      favorites: {
        include: {
          menu: true,
        },
      },
      _count: {
        select: {
          orders: true,
          reviews: true,
          favorites: true,
        },
      },
    },
  });

  if (!customer) {
    return null;
  }

  // Calculate stats
  const totalSpent = customer.orders.reduce((sum, order) => {
    return sum + Number(order.totalPrice);
  }, 0);

  const completedOrders = customer.orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  const averageOrderValue =
    customer.orders.length > 0 ? totalSpent / customer.orders.length : 0;

  // Convert Decimal fields in orders
  const ordersWithNumbers = customer.orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    discount: Number(order.discount),
    totalPrice: Number(order.totalPrice),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
      menu: item.menu
        ? {
            ...item.menu,
            price: Number(item.menu.price),
          }
        : null,
    })),
  }));

  return {
    ...customer,
    orders: ordersWithNumbers,
    totalSpent,
    completedOrders,
    averageOrderValue,
  };
}

export async function getCustomerStats() {
  const totalCustomers = await prisma.user.count({
    where: { role: "CUSTOMER" },
  });

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: true,
    },
  });

  const activeCustomers = customers.filter(
    (c) =>
      c.orders.some(
        (o) =>
          new Date(o.createdAt).getTime() >
          Date.now() - 30 * 24 * 60 * 60 * 1000
      ) // Last 30 days
  ).length;

  const newCustomers = customers.filter(
    (c) =>
      new Date(c.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
  ).length;

  const totalOrders = customers.reduce((sum, c) => sum + c.orders.length, 0);

  return {
    totalCustomers,
    activeCustomers,
    newCustomers,
    totalOrders,
  };
}
