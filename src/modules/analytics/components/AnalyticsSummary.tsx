import { formatPrice } from "@/shared/utils/price";

interface AnalyticsSummaryProps {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    averageOrderValue: number;
    newCustomers: number;
    activeCustomers: number;
  };
}

export function AnalyticsSummary({ summary }: AnalyticsSummaryProps) {
  const completionRate =
    summary.totalOrders > 0
      ? ((summary.completedOrders / summary.totalOrders) * 100).toFixed(1)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm opacity-90">Total Revenue</p>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-3xl font-bold">
          {formatPrice(summary.totalRevenue)}
        </p>
        <p className="text-xs mt-1 opacity-75">
          {summary.completedOrders} order selesai
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm opacity-90">Total Orders</p>
          <span className="text-2xl">📦</span>
        </div>
        <p className="text-3xl font-bold">{summary.totalOrders}</p>
        <p className="text-xs mt-1 opacity-75">
          {completionRate}% completion rate
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm opacity-90">Rata-rata Order</p>
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-3xl font-bold">
          {formatPrice(summary.averageOrderValue)}
        </p>
        <p className="text-xs mt-1 opacity-75">Per order yang selesai</p>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm opacity-90">Active Customers</p>
          <span className="text-2xl">👥</span>
        </div>
        <p className="text-3xl font-bold">{summary.activeCustomers}</p>
        <p className="text-xs mt-1 opacity-75">
          +{summary.newCustomers} customer baru
        </p>
      </div>
    </div>
  );
}
