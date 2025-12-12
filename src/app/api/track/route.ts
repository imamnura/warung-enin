import { NextRequest, NextResponse } from "next/server";
import { findOrderByNumberAndPhone } from "@/modules/order/tracking";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderNumber = searchParams.get("orderNumber");
  const phone = searchParams.get("phone");

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: "Order number and phone are required" },
      { status: 400 }
    );
  }

  try {
    const order = await findOrderByNumberAndPhone(orderNumber, phone);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}
