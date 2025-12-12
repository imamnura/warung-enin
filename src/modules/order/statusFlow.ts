/**
 * Order Status Flow Helper
 * Defines valid status transitions based on delivery method and payment method
 */

export type OrderStatus =
  | "ORDERED"
  | "PAYMENT_PENDING"
  | "PROCESSED"
  | "ON_DELIVERY"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type DeliveryMethod = "DIANTAR" | "AMBIL_SENDIRI";
export type PaymentMethod =
  | "CASH"
  | "QRIS"
  | "GOPAY"
  | "SHOPEEPAY"
  | "OVO"
  | "DANA"
  | "TRANSFER";

/**
 * Get valid next statuses based on current status and order details
 */
export function getValidNextStatuses(
  currentStatus: OrderStatus,
  deliveryMethod: DeliveryMethod,
  paymentMethod: PaymentMethod
): OrderStatus[] {
  const statusFlow: Record<OrderStatus, Record<string, OrderStatus[]>> = {
    ORDERED: {
      // Transfer: Need payment verification first
      TRANSFER: ["PAYMENT_PENDING", "CANCELLED"],
      QRIS: ["PAYMENT_PENDING", "CANCELLED"],
      GOPAY: ["PAYMENT_PENDING", "CANCELLED"],
      SHOPEEPAY: ["PAYMENT_PENDING", "CANCELLED"],
      OVO: ["PAYMENT_PENDING", "CANCELLED"],
      DANA: ["PAYMENT_PENDING", "CANCELLED"],
      // Cash: Can process directly
      CASH: ["PROCESSED", "CANCELLED"],
    },
    PAYMENT_PENDING: {
      // Waiting for payment verification (admin approve/reject)
      ALL: ["PROCESSED", "CANCELLED"], // Admin verifies -> PROCESSED, Reject -> CANCELLED
    },
    PROCESSED: {
      // Delivery: Goes to delivery
      DIANTAR: ["ON_DELIVERY", "CANCELLED"],
      // Pickup: Goes to ready
      AMBIL_SENDIRI: ["READY", "CANCELLED"],
    },
    ON_DELIVERY: {
      ALL: ["COMPLETED", "CANCELLED"],
    },
    READY: {
      ALL: ["COMPLETED", "CANCELLED"],
    },
    COMPLETED: {
      ALL: [], // Terminal state
    },
    CANCELLED: {
      ALL: [], // Terminal state
    },
  };

  // Get flow based on current status
  const flows = statusFlow[currentStatus];
  if (!flows) return [];

  // For PROCESSED, use delivery method
  if (currentStatus === "PROCESSED") {
    return flows[deliveryMethod] || flows.ALL || [];
  }

  // For ORDERED, use payment method
  if (currentStatus === "ORDERED") {
    return flows[paymentMethod] || flows.CASH;
  }

  // For others, use ALL
  return flows.ALL || [];
}

/**
 * Check if status transition is valid
 */
export function isValidStatusTransition(
  fromStatus: OrderStatus,
  toStatus: OrderStatus,
  deliveryMethod: DeliveryMethod,
  paymentMethod: PaymentMethod
): boolean {
  const validStatuses = getValidNextStatuses(
    fromStatus,
    deliveryMethod,
    paymentMethod
  );
  return validStatuses.includes(toStatus);
}

/**
 * Get recommended next status based on business logic
 */
export function getRecommendedNextStatus(
  currentStatus: OrderStatus,
  deliveryMethod: DeliveryMethod,
  paymentMethod: PaymentMethod,
  paymentVerified: boolean = false
): OrderStatus | null {
  switch (currentStatus) {
    case "ORDERED":
      // Transfer payment needs verification
      if (
        ["TRANSFER", "QRIS", "GOPAY", "SHOPEEPAY", "OVO", "DANA"].includes(
          paymentMethod
        )
      ) {
        return "PAYMENT_PENDING";
      }
      // Cash can process directly
      return "PROCESSED";

    case "PAYMENT_PENDING":
      // After payment verified by admin
      if (paymentVerified) {
        return "PROCESSED";
      }
      return null;

    case "PROCESSED":
      // Based on delivery method
      return deliveryMethod === "DIANTAR" ? "ON_DELIVERY" : "READY";

    case "ON_DELIVERY":
    case "READY":
      return "COMPLETED";

    case "COMPLETED":
    case "CANCELLED":
      return null; // Terminal states

    default:
      return null;
  }
}

/**
 * Get status label in Indonesian
 */
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    ORDERED: "Pesanan Masuk",
    PAYMENT_PENDING: "Menunggu Verifikasi Pembayaran",
    PROCESSED: "Sedang Diproses",
    ON_DELIVERY: "Dalam Pengiriman",
    READY: "Siap Diambil",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
  };
  return labels[status] || status;
}

/**
 * Get status color for badges
 */
export function getStatusColor(
  status: OrderStatus
): "primary" | "warning" | "success" | "danger" {
  const colors: Record<
    OrderStatus,
    "primary" | "warning" | "success" | "danger"
  > = {
    ORDERED: "warning",
    PAYMENT_PENDING: "warning",
    PROCESSED: "primary",
    ON_DELIVERY: "primary",
    READY: "success",
    COMPLETED: "success",
    CANCELLED: "danger",
  };
  return colors[status] || "primary";
}
