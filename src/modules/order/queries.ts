"use server";

import { prisma } from "@/lib/prisma";

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        items: {
          include: {
            menu: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert Decimal to number
    return orders.map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      discount: Number(order.discount),
      totalPrice: Number(order.totalPrice),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        menu: {
          ...item.menu,
          price: Number(item.menu.price),
        },
      })),
      payment: order.payment
        ? {
            ...order.payment,
            amount: Number(order.payment.amount),
          }
        : null,
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

export async function getOrderDetails(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: userId,
      },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        payment: true,
        customer: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        courier: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!order) return null;

    // Convert Decimal to number
    return {
      ...order,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      discount: Number(order.discount),
      totalPrice: Number(order.totalPrice),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        menu: {
          ...item.menu,
          price: Number(item.menu.price),
        },
      })),
      payment: order.payment
        ? {
            ...order.payment,
            amount: Number(order.payment.amount),
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
}

export async function reorderItems(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: userId,
      },
      include: {
        items: {
          include: {
            menu: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                isAvailable: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Filter only available items
    const availableItems = order.items
      .filter((item) => item.menu.isAvailable)
      .map((item) => ({
        menuId: item.menuId,
        name: item.menu.name,
        price: Number(item.menu.price),
        quantity: item.quantity,
        image: item.menu.images[0],
      }));

    if (availableItems.length === 0) {
      return { success: false, error: "No items available for reorder" };
    }

    return { success: true, items: availableItems };
  } catch (error) {
    console.error("Error reordering items:", error);
    return { success: false, error: "Failed to reorder" };
  }
}
