import Link from "next/link";
import { formatPrice } from "@/shared/utils/price";
import { Badge } from "@/shared/ui/Badge";

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: Date;
    ordersCount: number;
    totalSpent: number;
    lastOrderDate: Date | null;
  };
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link href={`/dashboard/customers/${customer.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {customer.name}
            </h3>
            {customer.email && (
              <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
            )}
            {customer.phone && (
              <p className="text-sm text-gray-600">📱 {customer.phone}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Total Order</p>
            <p className="text-xl font-bold text-blue-600">
              {customer.ordersCount}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Total Belanja</p>
            <p className="text-lg font-bold text-green-600">
              {formatPrice(customer.totalSpent)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Bergabung:{" "}
            {new Date(customer.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
            })}
          </span>
          {customer.lastOrderDate ? (
            <Badge color="success">
              Order terakhir:{" "}
              {new Date(customer.lastOrderDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </Badge>
          ) : (
            <Badge color="warning">Belum pernah order</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
