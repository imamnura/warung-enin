import { notFound } from "next/navigation";
import Link from "next/link";
import { getCustomerById } from "@/modules/customer/queries";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { formatPrice } from "@/shared/utils/price";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  const statusColors = {
    ORDERED: "primary",
    PAYMENT_PENDING: "warning",
    PROCESSED: "primary",
    ON_DELIVERY: "warning",
    READY: "success",
    COMPLETED: "success",
    CANCELLED: "danger",
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/customers">
            <Button variant="outline" className="mb-2">
              ← Kembali ke Daftar Customer
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Detail Customer</h1>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-4xl">👤</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {customer.name}
            </h2>
            <div className="space-y-1 text-gray-600">
              {customer.email && (
                <p className="flex items-center gap-2">
                  <span>📧</span>
                  <span>{customer.email}</span>
                </p>
              )}
              {customer.phone && (
                <p className="flex items-center gap-2">
                  <span>📱</span>
                  <span>{customer.phone}</span>
                </p>
              )}
              <p className="flex items-center gap-2">
                <span>📅</span>
                <span>
                  Bergabung sejak{" "}
                  {new Date(customer.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Order</p>
          <p className="text-3xl font-bold text-primary">
            {customer._count.orders}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Order Selesai</p>
          <p className="text-3xl font-bold text-green-600">
            {customer.completedOrders}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Belanja</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatPrice(customer.totalSpent)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Rata-rata Order</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatPrice(customer.averageOrderValue)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">
              Riwayat Order ({customer.orders.length})
            </h3>

            {customer.orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada riwayat order
              </p>
            ) : (
              <div className="space-y-4">
                {customer.orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders`}
                    className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <Badge color={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-gray-600">
                          {item.quantity}x{" "}
                          {item.menu?.name || "Menu tidak tersedia"}
                        </p>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {order.deliveryMethod === "DIANTAR"
                          ? "🏍️ Diantar"
                          : "🏪 Ambil Sendiri"}
                      </span>
                      <span className="font-bold text-primary">
                        {formatPrice(Number(order.totalPrice))}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Addresses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">
              Alamat Tersimpan ({customer.addresses.length})
            </h3>
            {customer.addresses.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Belum ada alamat tersimpan
              </p>
            ) : (
              <div className="space-y-3">
                {customer.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border-l-4 border-primary pl-3"
                  >
                    <p className="font-semibold text-sm">{address.label}</p>
                    <p className="text-xs text-gray-600">{address.address}</p>
                    {address.isDefault && (
                      <Badge color="success" className="mt-1">
                        Default
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">
              Ulasan ({customer._count.reviews})
            </h3>
            {customer.reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada ulasan</p>
            ) : (
              <div className="space-y-3">
                {customer.reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-3">
                    <p className="font-semibold text-sm">{review.menu.name}</p>
                    <div className="flex items-center gap-1 my-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorites */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">
              Menu Favorit ({customer._count.favorites})
            </h3>
            {customer.favorites.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada favorit</p>
            ) : (
              <div className="space-y-2">
                {customer.favorites.slice(0, 5).map((fav) => (
                  <div key={fav.id} className="flex items-center gap-2">
                    <span className="text-red-500">❤️</span>
                    <span className="text-sm">{fav.menu.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
