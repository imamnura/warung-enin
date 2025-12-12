"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, Truck, Package } from "lucide-react";

interface CourierStatsProps {
  totalCouriers: number;
  activeCouriers: number;
  busyCouriers: number;
  totalDeliveries: number;
}

export function CourierStats({
  totalCouriers,
  activeCouriers,
  busyCouriers,
  totalDeliveries,
}: CourierStatsProps) {
  const stats = [
    {
      label: "Total Kurir",
      value: totalCouriers,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-500",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Kurir Aktif",
      value: activeCouriers,
      icon: UserCheck,
      color: "green",
      bgColor: "bg-green-500",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Sedang Mengantar",
      value: busyCouriers,
      icon: Truck,
      color: "orange",
      bgColor: "bg-orange-500",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      label: "Total Pengiriman",
      value: totalDeliveries,
      icon: Package,
      color: "purple",
      bgColor: "bg-purple-500",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
          className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={`${stat.lightBg} p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
