"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NotificationBell } from "@/modules/notification/components/NotificationBell";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  user?: { name: string; phone: string } | null;
};

interface MenuItem {
  href: string;
  label: string;
  icon: string;
}

interface DashboardShellProps {
  userName: string;
  notifications: Notification[];
  unreadCount: number;
  menuItems: MenuItem[];
  children: React.ReactNode;
}

export function DashboardShell({
  userName,
  notifications,
  unreadCount,
  menuItems,
  children,
}: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Collapsible Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 fixed left-0 top-0 h-screen transition-all duration-300 z-20 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-primary-600 truncate">
                Warung Enin
              </h1>
              <p className="text-sm text-gray-600 mt-1 truncate">{userName}</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="text-lg">{isCollapsed ? "→" : "←"}</span>
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="p-4 space-y-2 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
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
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
            title={isCollapsed ? "Logout" : undefined}
          >
            <span className="text-xl flex-shrink-0">🚪</span>
            {!isCollapsed && <span className="truncate">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Top Bar with Notification */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end sticky top-0 z-10">
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
          />
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
