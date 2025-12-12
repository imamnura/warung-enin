import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, courierId } = body;

    if (!orderId || !courierId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate courier exists and is active
    const courier = await prisma.courier.findUnique({
      where: { id: courierId },
    });

    if (!courier) {
      return NextResponse.json({ error: "Courier not found" }, { status: 404 });
    }

    if (!courier.isActive) {
      return NextResponse.json(
        { error: "Courier is not active" },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { courierId },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error assigning courier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
