"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type NotificationType =
  | "NEW_ORDER"
  | "ORDER_STATUS"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "PROMO"
  | "SYSTEM";

export async function createNotification(data: {
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data as object | undefined,
      },
    });

    revalidatePath("/dashboard");
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

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
        OR: [
          { userId: null }, // System notifications
          { type: "NEW_ORDER" }, // All order notifications
        ],
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

export async function markAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false };
  }
}

export async function markAllAsRead(userId?: string) {
  try {
    if (userId) {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    } else {
      // For admin
      await prisma.notification.updateMany({
        where: {
          isRead: false,
          OR: [{ userId: null }, { type: "NEW_ORDER" }],
        },
        data: { isRead: true },
      });
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Semua notifikasi ditandai sudah dibaca" };
  } catch (error) {
    console.error("Error marking all as read:", error);
    return { success: false, message: "Gagal menandai notifikasi" };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Notifikasi dihapus" };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false, message: "Gagal menghapus notifikasi" };
  }
}

// WhatsApp notification helper (simplified, no actual API call)
export async function sendWhatsAppNotification(phone: string, message: string) {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    if (!settings?.whatsappEnabled || !settings.whatsappNumber) {
      console.log("WhatsApp notification disabled");
      return { success: false, message: "WhatsApp notification not enabled" };
    }

    // In production, integrate with WhatsApp Business API or services like Twilio, Fonnte, etc.
    console.log(`[WhatsApp] To: ${phone}, Message: ${message}`);

    return { success: true, message: "WhatsApp notification sent (simulated)" };
  } catch (error) {
    console.error("Error sending WhatsApp:", error);
    return { success: false, message: "Failed to send WhatsApp notification" };
  }
}

// Notification triggers
export async function notifyNewOrder(
  orderId: string,
  orderNumber: string,
  customerName: string
) {
  await createNotification({
    type: "NEW_ORDER",
    title: "Pesanan Baru! 🎉",
    message: `${customerName} membuat pesanan baru #${orderNumber}`,
    data: { orderId, orderNumber },
  });

  // Send WhatsApp to admin (optional)
  const settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });
  if (settings?.whatsappEnabled && settings.whatsappNumber) {
    await sendWhatsAppNotification(
      settings.whatsappNumber,
      `Pesanan baru #${orderNumber} dari ${customerName}`
    );
  }
}

export async function notifyOrderStatus(
  userId: string,
  orderNumber: string,
  status: string
) {
  const statusMessages: Record<string, string> = {
    PROCESSED: "Pesanan Anda sedang diproses",
    ON_DELIVERY: "Pesanan Anda sedang dikirim",
    READY: "Pesanan Anda siap diambil",
    COMPLETED: "Pesanan Anda selesai",
  };

  await createNotification({
    userId,
    type: "ORDER_STATUS",
    title: `Status Pesanan #${orderNumber}`,
    message: statusMessages[status] || "Status pesanan diperbarui",
    data: { orderNumber, status },
  });
}

export async function notifyPaymentSuccess(
  userId: string,
  orderNumber: string,
  amount: number
) {
  await createNotification({
    userId,
    type: "PAYMENT_SUCCESS",
    title: "Pembayaran Berhasil ✅",
    message: `Pembayaran pesanan #${orderNumber} sebesar Rp ${amount.toLocaleString(
      "id-ID"
    )} telah dikonfirmasi`,
    data: { orderNumber, amount },
  });
}
