// Menu Categories
export const MENU_CATEGORIES = {
  NASI: { label: "Nasi", emoji: "🍚" },
  LAUK: { label: "Lauk Pauk", emoji: "🍖" },
  BAKSO: { label: "Bakso", emoji: "🍜" },
  SOTO: { label: "Soto", emoji: "🍲" },
  AYAM: { label: "Ayam", emoji: "🍗" },
  MIE: { label: "Mie", emoji: "🍝" },
  MINUMAN: { label: "Minuman", emoji: "🥤" },
  SNACK: { label: "Snack", emoji: "🍪" },
  OTHER: { label: "Lainnya", emoji: "🍽️" },
} as const;

export type MenuCategoryKey = keyof typeof MENU_CATEGORIES;

// Order Status
export const ORDER_STATUS = {
  ORDERED: { label: "Pesanan Diterima", color: "blue" },
  PROCESSED: { label: "Sedang Diproses", color: "yellow" },
  ON_DELIVERY: { label: "Sedang Dikirim", color: "purple" },
  READY: { label: "Siap Diambil", color: "green" },
  COMPLETED: { label: "Selesai", color: "green" },
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: { label: "Menunggu Pembayaran", color: "yellow" },
  PAID: { label: "Lunas", color: "green" },
  FAILED: { label: "Gagal", color: "red" },
  REFUNDED: { label: "Dikembalikan", color: "gray" },
} as const;

export type PaymentStatusKey = keyof typeof PAYMENT_STATUS;

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: { label: "Cash", icon: "💵" },
  QRIS: { label: "QRIS", icon: "📱" },
  GOPAY: { label: "GoPay", icon: "🟢" },
  SHOPEEPAY: { label: "ShopeePay", icon: "🟠" },
  OVO: { label: "OVO", icon: "🟣" },
  DANA: { label: "DANA", icon: "🔵" },
  TRANSFER: { label: "Transfer Bank", icon: "🏦" },
} as const;

export type PaymentMethodKey = keyof typeof PAYMENT_METHODS;

// Delivery Methods
export const DELIVERY_METHODS = {
  DIANTAR: { label: "Diantar", icon: "🛵" },
  AMBIL_SENDIRI: { label: "Ambil Sendiri", icon: "🏃" },
} as const;

export type DeliveryMethodKey = keyof typeof DELIVERY_METHODS;

// User Roles
export const USER_ROLES = {
  ADMIN: { label: "Admin", color: "red" },
  CUSTOMER: { label: "Pelanggan", color: "blue" },
  COURIER: { label: "Kurir", color: "green" },
} as const;

export type UserRoleKey = keyof typeof USER_ROLES;

// Notification Types
export const NOTIFICATION_TYPES = {
  NEW_ORDER: { label: "Pesanan Baru", icon: "🔔" },
  ORDER_STATUS: { label: "Status Pesanan", icon: "📦" },
  PAYMENT_SUCCESS: { label: "Pembayaran Berhasil", icon: "✅" },
  PAYMENT_FAILED: { label: "Pembayaran Gagal", icon: "❌" },
  PROMO: { label: "Promo", icon: "🎉" },
  SYSTEM: { label: "Sistem", icon: "⚙️" },
} as const;

export type NotificationTypeKey = keyof typeof NOTIFICATION_TYPES;

// Spicy Levels
export const SPICY_LEVELS = [
  { value: 0, label: "Tidak Pedas", emoji: "😊" },
  { value: 1, label: "Sedikit Pedas", emoji: "😌" },
  { value: 2, label: "Pedas", emoji: "😋" },
  { value: 3, label: "Pedas Sedang", emoji: "🌶️" },
  { value: 4, label: "Pedas Banget", emoji: "🔥" },
  { value: 5, label: "Extra Pedas", emoji: "🔥🔥🔥" },
] as const;

// App Configuration
export const APP_CONFIG = {
  name: "Warung Enin",
  description: "Rasa Rumahan, Kualitas Juara",
  version: "1.0.0",
  location: "Taraju, Kabupaten Tasikmalaya",
  phone: "08xxxxxxxxxx",
  email: "info@warungenin.com",
  currency: "IDR",
  locale: "id-ID",
  timezone: "Asia/Jakarta",
} as const;

// Pagination
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
} as const;

// Image Upload
export const IMAGE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  maxImages: 5,
} as const;

// Default Values
export const DEFAULTS = {
  deliveryFee: 5000,
  minOrder: 15000,
  deliveryRadius: 5, // km
  prepTime: 30, // minutes
  taxPercentage: 0,
  serviceCharge: 0,
} as const;
