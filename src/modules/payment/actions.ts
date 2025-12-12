"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface PaymentFilters {
  status?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  method?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export async function getPayments(filters: PaymentFilters = {}) {
  const { status, method, dateFrom, dateTo, search } = filters;

  const payments = await prisma.payment.findMany({
    where: {
      ...(status && { status }),
      ...(method && {
        method: method as "CASH" | "QRIS" | "GOPAY" | "SHOPEEPAY" | "OVO",
      }),
      ...(dateFrom &&
        dateTo && {
          createdAt: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
          },
        }),
      ...(search && {
        OR: [
          { transactionId: { contains: search, mode: "insensitive" } },
          { order: { orderNumber: { contains: search, mode: "insensitive" } } },
          {
            order: {
              customer: { name: { contains: search, mode: "insensitive" } },
            },
          },
        ],
      }),
    },
    include: {
      order: {
        include: {
          customer: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments.map((payment) => ({
    ...payment,
    amount: Number(payment.amount),
    order: {
      ...payment.order,
      subtotal: Number(payment.order.subtotal),
      deliveryFee: Number(payment.order.deliveryFee),
      discount: Number(payment.order.discount),
      totalPrice: Number(payment.order.totalPrice),
    },
  }));
}

export async function getPaymentStats(filters: PaymentFilters = {}) {
  const { dateFrom, dateTo } = filters;

  const whereClause = {
    ...(dateFrom &&
      dateTo && {
        createdAt: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      }),
  };

  const [totalPayments, pendingPayments, paidPayments, failedPayments] =
    await Promise.all([
      prisma.payment.count({ where: whereClause }),
      prisma.payment.count({
        where: { ...whereClause, status: "PENDING" },
      }),
      prisma.payment.count({
        where: { ...whereClause, status: "PAID" },
      }),
      prisma.payment.count({
        where: { ...whereClause, status: "FAILED" },
      }),
    ]);

  const payments = await prisma.payment.findMany({
    where: whereClause,
    select: {
      amount: true,
      status: true,
      method: true,
    },
  });

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  const paidAmount = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingAmount = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  // Payment method breakdown
  const methodBreakdown = payments.reduce((acc, payment) => {
    const method = payment.method;
    if (!acc[method]) {
      acc[method] = { count: 0, amount: 0 };
    }
    acc[method].count += 1;
    acc[method].amount += Number(payment.amount);
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  return {
    totalPayments,
    pendingPayments,
    paidPayments,
    failedPayments,
    totalAmount,
    paidAmount,
    pendingAmount,
    methodBreakdown,
  };
}

export async function updatePaymentStatus(
  paymentId: string,
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
  transactionId?: string
) {
  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        ...(status === "PAID" && { paidAt: new Date() }),
        ...(transactionId && { transactionId }),
      },
    });

    revalidatePath("/dashboard/payments");
    return { success: true };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, error: "Gagal mengupdate status pembayaran" };
  }
}

export async function getPaymentById(id: string) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              menu: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    return null;
  }

  return {
    ...payment,
    amount: Number(payment.amount),
    order: {
      ...payment.order,
      totalPrice: Number(payment.order.totalPrice),
      subtotal: Number(payment.order.subtotal),
      deliveryFee: Number(payment.order.deliveryFee),
      discount: Number(payment.order.discount),
      items: payment.order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
    },
  };
}

export async function exportPaymentsToCSV(filters: PaymentFilters = {}) {
  const payments = await getPayments(filters);

  const csvHeader =
    "Tanggal,Nomor Order,Customer,Metode,Status,Jumlah,ID Transaksi\n";
  const csvRows = payments
    .map((payment) => {
      const date = new Date(payment.createdAt).toLocaleDateString("id-ID");
      const orderNumber = payment.order.orderNumber;
      const customer = payment.order.customer.name;
      const method = payment.method;
      const status = payment.status;
      const amount = payment.amount;
      const transactionId = payment.transactionId || "-";

      return `${date},"${orderNumber}","${customer}",${method},${status},${amount},"${transactionId}"`;
    })
    .join("\n");

  return csvHeader + csvRows;
}

/**
 * Upload bukti pembayaran transfer
 * Customer upload foto bukti transfer, status payment jadi PENDING (waiting verification)
 */
export async function uploadPaymentProof(orderId: string, imageBase64: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new Error("Order tidak ditemukan");
    }

    if (!order.payment) {
      throw new Error("Payment tidak ditemukan");
    }

    // Validate payment method (hanya transfer yang butuh bukti)
    if (order.payment.method === "CASH") {
      throw new Error("Pembayaran cash tidak memerlukan bukti transfer");
    }

    // Validate payment status
    if (order.payment.status !== "PENDING") {
      throw new Error("Pembayaran sudah diproses");
    }

    // Save image to public/uploads/payment-proofs
    const { writeFile, mkdir } = await import("fs/promises");
    const { join } = await import("path");
    const { randomUUID } = await import("crypto");

    const uploadDir = join(
      process.cwd(),
      "public",
      "uploads",
      "payment-proofs"
    );

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Extract base64 data
    const matches = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error("Format gambar tidak valid");
    }

    const imageType = matches[1];
    const imageData = matches[2];
    const fileName = `${randomUUID()}.${imageType}`;
    const filePath = join(uploadDir, fileName);
    const publicUrl = `/uploads/payment-proofs/${fileName}`;

    // Write file
    await writeFile(filePath, Buffer.from(imageData, "base64"));

    // Update payment record
    await prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        proofImage: publicUrl,
      },
    });

    // Update order status to PAYMENT_PENDING (waiting admin verification)
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAYMENT_PENDING",
      },
    });

    revalidatePath("/track");
    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/orders");

    return { success: true, imageUrl: publicUrl };
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal upload bukti pembayaran"
    );
  }
}

/**
 * Admin verifikasi pembayaran
 * Admin approve/reject bukti transfer
 */
export async function verifyPayment(
  paymentId: string,
  approved: boolean,
  adminId: string,
  notes?: string
) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new Error("Payment tidak ditemukan");
    }

    if (payment.status !== "PENDING") {
      throw new Error("Payment sudah diverifikasi");
    }

    if (approved) {
      // Approve payment
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "VERIFIED",
          verifiedAt: new Date(),
          verifiedBy: adminId,
          paidAt: new Date(),
          notes,
        },
      });

      // Update order status to PROCESSED (mulai dimasak)
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: "PROCESSED",
        },
      });
    } else {
      // Reject payment
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "FAILED",
          verifiedAt: new Date(),
          verifiedBy: adminId,
          notes: notes || "Bukti pembayaran ditolak",
        },
      });

      // Cancel order
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: "CANCELLED",
        },
      });
    }

    revalidatePath("/track");
    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/orders");

    return { success: true };
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal verifikasi pembayaran"
    );
  }
}

/**
 * Kurir konfirmasi terima pembayaran cash dari customer
 */
export async function confirmCashPayment(orderId: string, courierId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new Error("Order tidak ditemukan");
    }

    if (!order.payment) {
      throw new Error("Payment tidak ditemukan");
    }

    if (order.payment.method !== "CASH") {
      throw new Error("Bukan pembayaran cash");
    }

    if (order.payment.status !== "PENDING") {
      throw new Error("Pembayaran sudah dikonfirmasi");
    }

    // Update payment to PAID (cash received by courier)
    await prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        notes: `Cash diterima oleh kurir (${courierId})`,
      },
    });

    // Update order status to COMPLETED (delivery done)
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    revalidatePath("/track");
    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/orders");

    return { success: true };
  } catch (error) {
    console.error("Error confirming cash payment:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal konfirmasi pembayaran cash"
    );
  }
}

/**
 * Kurir serahkan cash ke kasir warung
 */
export async function handOverCash(paymentId: string, courierId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error("Payment tidak ditemukan");
    }

    if (payment.method !== "CASH") {
      throw new Error("Bukan pembayaran cash");
    }

    if (payment.status !== "PAID") {
      throw new Error("Cash belum diterima dari customer");
    }

    if (payment.courierHandedAt) {
      throw new Error("Cash sudah diserahkan");
    }

    // Update payment: cash handed over to warung
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "HANDED_OVER",
        courierHandedAt: new Date(),
        courierHandedBy: courierId,
      },
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/couriers");

    return { success: true };
  } catch (error) {
    console.error("Error handing over cash:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal serahkan cash"
    );
  }
}

/**
 * Get pending payment verifications (untuk admin)
 */
export async function getPendingPaymentVerifications() {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        status: "PENDING",
        proofImage: { not: null },
      },
      include: {
        order: {
          include: {
            customer: true,
            items: {
              include: {
                menu: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Convert Decimal to number for serialization
    return payments.map((payment) => ({
      ...payment,
      amount: Number(payment.amount),
      order: {
        ...payment.order,
        subtotal: Number(payment.order.subtotal),
        deliveryFee: Number(payment.order.deliveryFee),
        discount: Number(payment.order.discount),
        totalPrice: Number(payment.order.totalPrice),
        items: payment.order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
          menu: {
            ...item.menu,
            price: Number(item.menu.price),
          },
        })),
      },
    }));
  } catch (error) {
    console.error("Error getting pending verifications:", error);
    throw new Error("Gagal mengambil data verifikasi pembayaran");
  }
}

/**
 * Get cash belum diserahkan (untuk kurir tracking)
 */
export async function getPendingCashHandovers(courierId?: string) {
  try {
    const where = {
      method: "CASH" as const,
      status: "PAID" as const,
      courierHandedAt: null,
    };

    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
            courier: true,
          },
        },
      },
      orderBy: {
        paidAt: "asc",
      },
    });

    // Filter by courier if specified
    const filtered = courierId
      ? payments.filter((p) => p.order.courierId === courierId)
      : payments;

    // Convert Decimal to number
    return filtered.map((payment) => ({
      ...payment,
      amount: Number(payment.amount),
      order: {
        ...payment.order,
        subtotal: Number(payment.order.subtotal),
        deliveryFee: Number(payment.order.deliveryFee),
        discount: Number(payment.order.discount),
        totalPrice: Number(payment.order.totalPrice),
      },
    }));
  } catch (error) {
    console.error("Error getting pending cash handovers:", error);
    throw new Error("Gagal mengambil data cash belum diserahkan");
  }
}
