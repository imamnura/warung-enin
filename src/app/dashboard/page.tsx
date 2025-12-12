import { getDashboardAnalytics } from "@/modules/dashboard/queries";
import { MetricsGrid } from "@/modules/dashboard/components/MetricsGrid";
import { RecentOrdersTable } from "@/modules/dashboard/components/RecentOrdersTable";
import { OrderStatusChart } from "@/modules/dashboard/components/OrderStatusChart";
import { Suspense } from "react";
import { SkeletonStats } from "@/shared/ui/Skeleton";

async function DashboardContent() {
  const analytics = await getDashboardAnalytics();

  return (
    <>
      {/* Metrics */}
      <MetricsGrid {...analytics.metrics} />

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart data={analytics.ordersByStatus} />
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Menu Populer
          </h3>
          {analytics.popularMenus.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {analytics.popularMenus.map((menu, index) => (
                <div key={menu.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{menu.name}</p>
                    <p className="text-sm text-gray-600">
                      {menu.orderCount} pesanan
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable orders={analytics.recentOrders} />
    </>
  );
}

export default async function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Selamat datang kembali di Warung Enin
        </p>
      </div>

      <Suspense fallback={<SkeletonStats />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
