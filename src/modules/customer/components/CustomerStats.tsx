interface CustomerStatsProps {
  stats: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    totalOrders: number;
  };
}

export function CustomerStats({ stats }: CustomerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Total Customer</p>
          <span className="text-2xl">👥</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {stats.totalCustomers}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Customer Aktif</p>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-3xl font-bold text-green-600">
          {stats.activeCustomers}
        </p>
        <p className="text-xs text-gray-500 mt-1">Order dalam 30 hari</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Customer Baru</p>
          <span className="text-2xl">🆕</span>
        </div>
        <p className="text-3xl font-bold text-blue-600">{stats.newCustomers}</p>
        <p className="text-xs text-gray-500 mt-1">30 hari terakhir</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Total Order</p>
          <span className="text-2xl">📦</span>
        </div>
        <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
        <p className="text-xs text-gray-500 mt-1">Semua customer</p>
      </div>
    </div>
  );
}
