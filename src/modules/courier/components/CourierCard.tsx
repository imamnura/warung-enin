"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Car,
  MapPin,
  CreditCard,
  Package,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";

interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: string | null;
  vehicleNumber: string | null;
  address: string | null;
  idCard: string | null;
  isActive: boolean;
  _count?: {
    orders: number;
  };
}

interface CourierCardProps {
  courier: Courier;
  onEdit: (courier: Courier) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function CourierCard({
  courier,
  onEdit,
  onDelete,
  onToggleStatus,
}: CourierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      className="relative bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden"
    >
      {/* Header with Status */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {courier.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4" />
              {courier.phone}
            </div>
          </div>
          <Badge variant={courier.isActive ? "success" : "danger"}>
            {courier.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="space-y-2">
          {courier.vehicle && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Car className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{courier.vehicle}</span>
              {courier.vehicleNumber && (
                <span className="text-slate-400">
                  • {courier.vehicleNumber}
                </span>
              )}
            </div>
          )}

          {courier.address && (
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{courier.address}</span>
            </div>
          )}

          {courier.idCard && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <span>{courier.idCard}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {courier._count && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-slate-900">
                {courier._count.orders}
              </span>
              <span className="text-slate-600">Total Pengiriman</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-slate-100/50 border-t border-slate-200 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleStatus(courier.id)}
          className="flex-1"
        >
          {courier.isActive ? (
            <>
              <ToggleRight className="w-4 h-4 mr-1" />
              Nonaktifkan
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4 mr-1" />
              Aktifkan
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(courier)}
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(courier.id)}
          className="px-3"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
