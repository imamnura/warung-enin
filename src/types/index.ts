export type {
  User,
  Courier,
  Menu,
  Order,
  OrderItem,
  Payment,
  Review,
  Notification,
  Settings,
  Role,
  MenuCategory,
  OrderStatus,
  DeliveryMethod,
  PaymentStatus,
  PaymentMethod,
  NotificationType,
} from "@/generated/prisma/client";

// Custom types

export interface MenuWithDetails extends Menu {
  reviews?: Review[];
  _count?: {
    reviews: number;
    items: number;
  };
  avgRating?: number;
}

export interface OrderWithDetails extends Order {
  customer: User;
  courier?: Courier | null;
  items: (OrderItem & { menu: Menu })[];
  payment?: Payment | null;
}

export interface CreateMenuInput {
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  images: string[];
  isAvailable?: boolean;
  stock?: number;
  prepTime?: number;
  spicyLevel?: number;
}

export interface UpdateMenuInput extends Partial<CreateMenuInput> {
  id: string;
}

export interface CreateOrderInput {
  items: Array<{
    menuId: string;
    quantity: number;
    notes?: string;
  }>;
  deliveryMethod: DeliveryMethod;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  address?: string;
  notes?: string;
  promoCode?: string;
}

export interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
  estimatedTime?: Date;
}

export interface AssignCourierInput {
  orderId: string;
  courierId: string;
}

export interface CreatePaymentInput {
  orderId: string;
  method: PaymentMethod;
  amount: number;
}

export interface UpdatePaymentInput {
  paymentId: string;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
  metadata?: unknown;
}

export interface CreateReviewInput {
  menuId: string;
  userId: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalMenus: number;
  popularMenus: Array<{ menu: Menu; orderCount: number }>;
  revenueChart: Array<{ date: string; revenue: number }>;
}

export interface FilterOptions {
  search?: string;
  category?: MenuCategory;
  status?: OrderStatus | PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Import statement for generated types
import type {
  Menu,
  Order,
  OrderItem,
  User,
  Courier,
  Payment,
  Review,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Notification,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Settings,
  MenuCategory,
  OrderStatus,
  DeliveryMethod,
  PaymentStatus,
  PaymentMethod,
} from "@/generated/prisma/client";
