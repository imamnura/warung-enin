"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type OrderStatusData = {
  status: string;
  count: number;
};

type OrderStatusChartProps = {
  data: OrderStatusData[];
};

const statusLabels: Record<string, string> = {
  ORDERED: "Dipesan",
  PROCESSED: "Diproses",
  ON_DELIVERY: "Dikirim",
  READY: "Siap",
  COMPLETED: "Selesai",
};

const COLORS: Record<string, string> = {
  ORDERED: "#3B82F6", // blue
  PROCESSED: "#F59E0B", // yellow
  ON_DELIVERY: "#8B5CF6", // purple
  READY: "#10B981", // green
  COMPLETED: "#6B7280", // gray
};

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = data.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    status: item.status,
  }));

  if (chartData.length === 0 || chartData.every((d) => d.value === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Status Pesanan
        </h3>
        <p className="text-gray-500 text-center py-8">Belum ada data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribusi Status Pesanan
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${((percent || 0) * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.status] || "#6B7280"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
