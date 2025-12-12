"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateOrderNumber } from "@/lib/utils";
import {
  validatePromoCode,
  incrementPromoUsage,
} from "@/modules/promo/actions";
import {
  notifyNewOrder,
  notifyOrderStatus,
} from "@/modules/notification/actions";
import type { CreateOrderInput } from "@/types";

export async function createOrder(input: CreateOrderInput) {
  try {
    if (!input.items.length) {
      throw new Error("Items required");
    }

    // Sanitize input: convert "$undefined" strings to undefined/null
    const sanitizedInput = {
      ...input,
      promoCode:
        input.promoCode && input.promoCode !== "$undefined"
          ? input.promoCode
          : undefined,
      notes:
        input.notes && input.notes !== "$undefined" ? input.notes : undefined,
      address:
        input.address && input.address !== "$undefined"
          ? input.address
          : undefined,
      items: input.items.map((item) => ({
        ...item,
        notes:
          item.notes && item.notes !== "$undefined" ? item.notes : undefined,
      })),
    };

    // Upsert user
    const user = await prisma.user.upsert({
      where: { phone: sanitizedInput.customer.phone },
      update: {
        name: sanitizedInput.customer.name,
        email: sanitizedInput.customer.email,
      },
      create: {
        name: sanitizedInput.customer.name,
        phone: sanitizedInput.customer.phone,
        email: sanitizedInput.customer.email,
        role: "CUSTOMER",
      },
    });

    // Get menus
    const menus = await prisma.menu.findMany({
      where: { id: { in: sanitizedInput.items.map((i) => i.menuId) } },
    });

    // Calculate totals
    const menuMap = new Map(menus.map((m) => [m.id, m]));
    let subtotal = 0;
    const itemsData = sanitizedInput.items.map((i) => {
      const menu = menuMap.get(i.menuId);
      if (!menu) throw new Error(`Menu ${i.menuId} not found`);
      const price = Number(menu.price);
      const itemSubtotal = price * i.quantity;
      subtotal += itemSubtotal;
      return {
        menuId: i.menuId,
        quantity: i.quantity,
        price,
        subtotal: itemSubtotal,
        notes: i.notes,
      };
    });

    // Check if user is a member (has password = registered account)
    const isMember = !!user.password;

    // Calculate delivery fee based on member status
    // Member: FREE delivery, Non-member: Rp 2,000 (DIANTAR only)
    let deliveryFee = 0;
    if (sanitizedInput.deliveryMethod === "DIANTAR") {
      deliveryFee = isMember ? 0 : 2000;
    }
    let discount = 0;

    // Validate and apply promo code
    if (sanitizedInput.promoCode) {
      const promoResult = await validatePromoCode(
        sanitizedInput.promoCode,
        subtotal
      );

      if (promoResult.valid && promoResult.promo) {
        if (promoResult.promo.type === "FREE_DELIVERY") {
          deliveryFee = 0;
        } else {
          discount = promoResult.promo.discount;
        }
      }
    }
    const totalPrice = subtotal + deliveryFee - discount;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: user.id,
        deliveryMethod: sanitizedInput.deliveryMethod,
        address: sanitizedInput.address,
        notes: sanitizedInput.notes,
        status: "ORDERED",
        isMember, // Track member status at order time
        subtotal,
        deliveryFee,
        discount,
        totalPrice,
        promoCode: sanitizedInput.promoCode,
        items: { create: itemsData },
        payment: {
          create: {
            amount: totalPrice,
            method: "CASH", // Default, will be updated
            status: "PENDING",
          },
        },
      },
      include: {
        items: { include: { menu: true } },
        customer: true,
        payment: true,
      },
    });

    // Update menu order count
    await Promise.all(
      sanitizedInput.items.map((item) =>
        prisma.menu.update({
          where: { id: item.menuId },
          data: { orderCount: { increment: item.quantity } },
        })
      )
    );

    // Increment promo usage count if promo was applied
    if (sanitizedInput.promoCode) {
      await incrementPromoUsage(sanitizedInput.promoCode);
    }

    // Send notification for new order
    await notifyNewOrder(order.id, order.orderNumber, user.name);

    revalidatePath("/track");
    revalidatePath("/dashboard");

    // Return only serializable data (no Date or Decimal objects)
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalPrice: Number(order.totalPrice),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create order"
    );
  }
}

export async function listOrders() {
  return prisma.order.findMany({
    include: {
      customer: true,
      courier: true,
      items: { include: { menu: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      courier: true,
      items: { include: { menu: true } },
      payment: true,
    },
  });
}

export async function setOrderStatus(
  orderId: string,
  status:
    | "ORDERED"
    | "PAYMENT_PENDING"
    | "PROCESSED"
    | "ON_DELIVERY"
    | "READY"
    | "COMPLETED"
    | "CANCELLED"
) {
  const data: Record<string, unknown> = { status };

  if (status === "COMPLETED") {
    data.completedAt = new Date();

    // Update customer total orders count when order completed
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { customerId: true },
    });

    if (order) {
      await prisma.user.update({
        where: { id: order.customerId },
        data: { totalOrders: { increment: 1 } },
      });
    }
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data,
    include: {
      customer: true,
    },
  });

  // Send notification to customer about status change
  if (updatedOrder.customerId && status !== "ORDERED") {
    await notifyOrderStatus(
      updatedOrder.customerId,
      updatedOrder.orderNumber,
      status
    );
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/track");

  return updatedOrder;
}

export async function assignCourier(orderId: string, courierId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { courierId },
  });

  revalidatePath("/dashboard/orders");

  return order;
}
