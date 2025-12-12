import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrderDetails } from "@/modules/order/queries";
import { OrderDetailView } from "@/modules/order/components/OrderDetailView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profile/orders");
  }

  const order = await getOrderDetails(id, session.user.id);

  if (!order) {
    redirect("/profile/orders");
  }

  return <OrderDetailView order={order} userId={session.user.id} />;
}
