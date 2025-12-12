import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserOrders } from "@/modules/order/queries";
import { OrderCard } from "@/modules/order/components/OrderCard";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";

export default async function OrderHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profile/orders");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Riwayat Pesanan</h1>
              <p className="text-gray-600 mt-1">
                Lihat semua pesanan yang pernah Anda buat
              </p>
            </div>
            <Link href="/profile">
              <Button variant="outline">Kembali</Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-semibold mb-2">Belum Ada Pesanan</h2>
              <p className="text-gray-600 mb-6">
                Anda belum memiliki riwayat pesanan. Mulai pesan sekarang!
              </p>
              <Link href="/reservation">
                <Button>Lihat Menu</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
