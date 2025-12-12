import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const couriers = await prisma.courier.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(couriers);
  } catch (error) {
    console.error("Error fetching couriers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
