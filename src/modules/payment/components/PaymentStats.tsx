import { formatPrice } from "@/shared/utils/price";

interface PaymentStatsProps {
  stats: {
    totalPayments: number;
    pendingPayments: number;
    paidPayments: number;
    failedPayments: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    methodBreakdown: Record<string, { count: number; amount: number }>;
  };
}

export function PaymentStats({ stats }: PaymentStatsProps) {
  return (
    <div className="space-y-6 mb-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Pembayaran</p>
            <span className="text-2xl">💳</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalPayments}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Lunas</p>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {stats.paidPayments}
          </p>
          <p className="text-sm text-green-600 font-semibold mt-1">
            {formatPrice(stats.paidAmount)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending</p>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.pendingPayments}
          </p>
          <p className="text-sm text-yellow-600 font-semibold mt-1">
            {formatPrice(stats.pendingAmount)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Gagal</p>
            <span className="text-2xl">❌</span>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {stats.failedPayments}
          </p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Breakdown Metode Pembayaran</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(stats.methodBreakdown).map(([method, data]) => (
            <div key={method} className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">{method}</p>
              <p className="text-xl font-bold text-primary">{data.count}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatPrice(data.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
