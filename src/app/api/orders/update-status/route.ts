import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/enums";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate status
    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get order to validate
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        deliveryMethod: true,
        courierId: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Validate: DIANTAR orders must have courier before ON_DELIVERY
    if (
      order.deliveryMethod === "DIANTAR" &&
      status === "ON_DELIVERY" &&
      !order.courierId
    ) {
      return NextResponse.json(
        { error: "Assign courier first for delivery orders" },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
