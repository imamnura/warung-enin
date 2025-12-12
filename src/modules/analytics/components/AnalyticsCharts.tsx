"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { formatPrice } from "@/shared/utils/price";

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    }),
    revenue: item.revenue,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Trend Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => formatPrice(value)}
            labelStyle={{ color: "#000" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface OrderStatusChartProps {
  data: Record<string, number>;
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const COLORS = {
    ORDERED: "#3b82f6",
    PROCESSED: "#f59e0b",
    ON_DELIVERY: "#8b5cf6",
    READY: "#10b981",
    COMPLETED: "#22c55e",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Status Order</h3>
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
                fill={COLORS[entry.name as keyof typeof COLORS] || "#94a3b8"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PaymentMethodChartProps {
  data: Record<string, number>;
}

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const chartData = Object.entries(data).map(([method, amount]) => ({
    method,
    amount,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Metode Pembayaran</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="method" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => formatPrice(value)}
            labelStyle={{ color: "#000" }}
          />
          <Legend />
          <Bar dataKey="amount" fill="#10b981" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryPerformanceChartProps {
  data: Record<string, { revenue: number; quantity: number; orders: number }>;
}

export function CategoryPerformanceChart({
  data,
}: CategoryPerformanceChartProps) {
  const chartData = Object.entries(data)
    .map(([category, stats]) => ({
      category,
      revenue: stats.revenue,
      quantity: stats.quantity,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Performa Kategori</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip labelStyle={{ color: "#000" }} />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" name="Revenue" />
          <Bar
            yAxisId="right"
            dataKey="quantity"
            fill="#3b82f6"
            name="Quantity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
