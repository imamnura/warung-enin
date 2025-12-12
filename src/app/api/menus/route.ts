import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: [{ isPopular: "desc" }, { orderCount: "desc" }, { name: "asc" }],
    });

    // Convert Decimal to number for JSON serialization
    const serializedMenus = menus.map((menu) => ({
      ...menu,
      price: Number(menu.price),
    }));

    return NextResponse.json(serializedMenus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { error: "Failed to fetch menus" },
      { status: 500 }
    );
  }
}
