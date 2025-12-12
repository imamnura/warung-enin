"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userName: string;
  onLogout: () => void;
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/menu", label: "Menu", icon: "🍽️" },
  { href: "/dashboard/orders", label: "Orders", icon: "📦" },
  { href: "/dashboard/customers", label: "Customers", icon: "👥" },
  { href: "/dashboard/couriers", label: "Couriers", icon: "🛵" },
  { href: "/dashboard/payments", label: "Payments", icon: "💰" },
  { href: "/dashboard/promo", label: "Promo", icon: "🎁" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export function CollapsibleSidebar({ userName, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 fixed left-0 top-0 h-screen transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary-600">Warung Enin</h1>
            <p className="text-sm text-gray-600 mt-1 truncate">{userName}</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive(item.href)
                ? "bg-primary text-white"
                : "hover:bg-primary-50 text-gray-700 hover:text-primary-700"
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}

        <hr className="my-4 border-gray-200" />

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
          title={isCollapsed ? "Logout" : undefined}
        >
          <span className="text-xl flex-shrink-0">🚪</span>
          {!isCollapsed && <span className="truncate">Logout</span>}
        </button>
      </nav>
    </aside>
  );
}
