import { prisma } from "@/lib/prisma";

export async function findOrderByNumberAndPhone(
  orderNumber: string,
  phone: string
) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      customer: true,
      courier: true,
      items: { include: { menu: true } },
      payment: true,
    },
  });

  if (!order || order.customer.phone !== phone) {
    return null;
  }

  return order;
}
