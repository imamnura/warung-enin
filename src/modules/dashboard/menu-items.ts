import { checkPermission } from "@/lib/permissions";

export interface MenuItem {
  href: string;
  label: string;
  icon: string;
  resource: string;
  action: "READ" | "MANAGE";
}

const ALL_MENU_ITEMS: MenuItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "📊",
    resource: "ANALYTICS",
    action: "READ",
  },
  {
    href: "/dashboard/menu",
    label: "Menu",
    icon: "🍽️",
    resource: "MENU",
    action: "MANAGE",
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: "📦",
    resource: "ORDER",
    action: "MANAGE",
  },
  {
    href: "/dashboard/customers",
    label: "Customers",
    icon: "👥",
    resource: "CUSTOMER",
    action: "MANAGE",
  },
  {
    href: "/dashboard/couriers",
    label: "Couriers",
    icon: "🛵",
    resource: "COURIER",
    action: "MANAGE",
  },
  {
    href: "/dashboard/payments",
    label: "Payments",
    icon: "💰",
    resource: "PAYMENT",
    action: "MANAGE",
  },
  {
    href: "/dashboard/promo",
    label: "Promo",
    icon: "🎁",
    resource: "PROMO",
    action: "MANAGE",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: "📈",
    resource: "ANALYTICS",
    action: "MANAGE",
  },
  {
    href: "/dashboard/hero-slides",
    label: "Hero Slides",
    icon: "🎬",
    resource: "SETTINGS",
    action: "MANAGE",
  },
  {
    href: "/dashboard/privileges",
    label: "Hak Akses",
    icon: "🔐",
    resource: "PRIVILEGE",
    action: "MANAGE",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: "⚙️",
    resource: "SETTINGS",
    action: "MANAGE",
  },
];

/**
 * Get accessible menu items based on user's role and permissions
 */
export async function getAccessibleMenuItems(
  role: "ADMIN" | "CUSTOMER" | "COURIER"
): Promise<MenuItem[]> {
  const accessibleItems: MenuItem[] = [];

  for (const item of ALL_MENU_ITEMS) {
    const hasPermission = await checkPermission(
      role,
      item.resource as any,
      item.action as any
    );

    if (hasPermission) {
      accessibleItems.push(item);
    }
  }

  return accessibleItems;
}
