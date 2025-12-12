import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getNotifications,
  getUnreadCount,
} from "@/modules/notification/queries";
import { DashboardShell } from "@/modules/dashboard/components/DashboardShell";
import { getAccessibleMenuItems } from "@/modules/dashboard/menu-items";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const [notifications, unreadCount, menuItems] = await Promise.all([
    getNotifications(),
    getUnreadCount(),
    getAccessibleMenuItems(session.user?.role as any),
  ]);

  return (
    <DashboardShell
      userName={session.user?.name || "Admin"}
      notifications={notifications}
      unreadCount={unreadCount}
      menuItems={menuItems}
    >
      {children}
    </DashboardShell>
  );
}
