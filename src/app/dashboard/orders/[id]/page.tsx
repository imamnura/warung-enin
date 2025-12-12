import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        },
      },
      courier: true,
      items: {
        include: {
          menu: {
            select: {
              name: true,
              images: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ORDERED: "bg-yellow-100 text-yellow-800",
      PROCESSED: "bg-blue-100 text-blue-800",
      ON_DELIVERY: "bg-purple-100 text-purple-800",
      READY: "bg-green-100 text-green-800",
      COMPLETED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/orders"
            className="text-sm text-primary hover:text-primary-600 mb-2 inline-block"
          >
            ← Kembali ke Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-600 mt-1">
            Dibuat pada{" "}
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-bold mb-4">Item Pesanan</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-b-0"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {item.menu.images[0] ? (
                      <Image
                        src={item.menu.images[0]}
                        alt={item.menu.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.menu.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x Rp{" "}
                      {Number(item.price).toLocaleString("id-ID")}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        Catatan: {item.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      Rp {Number(item.subtotal).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  Rp {Number(order.subtotal).toLocaleString("id-ID")}
                </span>
              </div>
              {Number(order.deliveryFee) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Biaya Pengiriman</span>
                  <span className="font-medium">
                    Rp {Number(order.deliveryFee).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Diskon</span>
                  <span className="font-medium text-green-600">
                    -Rp {Number(order.discount).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>
                  Rp {Number(order.totalPrice).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Order History/Timeline */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-bold mb-4">Riwayat Pesanan</h2>
            <div className="space-y-4">
              {/* Timeline */}
              <div className="relative pl-8 pb-4 border-l-2 border-gray-200">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                <div className="mb-1 text-sm font-medium">Pesanan Dibuat</div>
                <div className="text-xs text-gray-600">
                  {new Date(order.createdAt).toLocaleString("id-ID")}
                </div>
              </div>

              {order.status !== "ORDERED" && (
                <div className="relative pl-8 pb-4 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <div className="mb-1 text-sm font-medium">Diproses</div>
                  <div className="text-xs text-gray-600">
                    {new Date(order.updatedAt).toLocaleString("id-ID")}
                  </div>
                </div>
              )}

              {order.courierId && (
                <div className="relative pl-8 pb-4 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <div className="mb-1 text-sm font-medium">
                    Kurir Di-assign
                  </div>
                  <div className="text-xs text-gray-600">
                    Kurir: {order.courier?.name}
                  </div>
                </div>
              )}

              {order.status === "COMPLETED" && order.completedAt && (
                <div className="relative pl-8">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="mb-1 text-sm font-medium">Selesai</div>
                  <div className="text-xs text-gray-600">
                    {new Date(order.completedAt).toLocaleString("id-ID")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-bold mb-4">Informasi Pelanggan</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Nama</div>
                <div className="font-medium">{order.customer.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Nomor HP</div>
                <div className="font-medium">{order.customer.phone}</div>
              </div>
              {order.customer.email && (
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{order.customer.email}</div>
                </div>
              )}
              <div className="pt-3 border-t">
                <Link href={`/dashboard/customers/${order.customer.id}`}>
                  <Button variant="outline" className="w-full text-sm">
                    Lihat Profil
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-bold mb-4">Informasi Pengiriman</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Metode</div>
                <div className="font-medium">
                  {order.deliveryMethod === "DIANTAR"
                    ? "Delivery"
                    : "Take Away"}
                </div>
              </div>

              {order.deliveryMethod === "DIANTAR" && (
                <>
                  <div>
                    <div className="text-sm text-gray-600">Alamat</div>
                    <div className="font-medium">{order.address || "-"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Kurir</div>
                    <div className="font-medium">
                      {order.courier?.name || "Belum di-assign"}
                    </div>
                    {order.courier && (
                      <div className="text-sm text-gray-600">
                        {order.courier.phone}
                      </div>
                    )}
                  </div>
                </>
              )}

              {order.estimatedTime && (
                <div>
                  <div className="text-sm text-gray-600">Estimasi</div>
                  <div className="font-medium">
                    {new Date(order.estimatedTime).toLocaleString("id-ID")}
                  </div>
                </div>
              )}

              {order.notes && (
                <div>
                  <div className="text-sm text-gray-600">Catatan</div>
                  <div className="font-medium">{order.notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          {order.payment && (
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-bold mb-4">Informasi Pembayaran</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <Badge
                    color={
                      order.payment.status === "PAID" ? "success" : "warning"
                    }
                  >
                    {order.payment.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Metode</div>
                  <div className="font-medium">{order.payment.method}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Jumlah</div>
                  <div className="font-medium">
                    Rp {Number(order.payment.amount).toLocaleString("id-ID")}
                  </div>
                </div>
                {order.payment.paidAt && (
                  <div>
                    <div className="text-sm text-gray-600">Dibayar pada</div>
                    <div className="text-sm">
                      {new Date(order.payment.paidAt).toLocaleString("id-ID")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
