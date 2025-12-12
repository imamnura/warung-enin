import { prisma } from "@/lib/prisma";

export async function getNotifications(userId?: string) {
  try {
    if (userId) {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    // For admin: get all notifications or system notifications
    return await prisma.notification.findMany({
      where: {
        OR: [{ userId: null }, { type: "NEW_ORDER" }],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
}

export async function getUnreadCount(userId?: string) {
  try {
    if (userId) {
      return await prisma.notification.count({
        where: { userId, isRead: false },
      });
    }

    // For admin
    return await prisma.notification.count({
      where: {
        isRead: false,
        OR: [{ userId: null }, { type: "NEW_ORDER" }],
      },
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}
