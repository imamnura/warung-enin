import { listOrders } from "@/modules/order/actions";
import { OrderTable } from "@/modules/order/components/OrderTable";

export default async function OrdersPage() {
  const orders = await listOrders();

  // Transform orders for client component
  const transformedOrders = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customer: {
      name: order.customer.name,
      phone: order.customer.phone,
    },
    courier: order.courier ? { name: order.courier.name } : null,
    status: order.status,
    deliveryMethod: order.deliveryMethod,
    totalPrice: Number(order.totalPrice),
    courierId: order.courierId,
    createdAt: order.createdAt.toISOString(),
  }));

  return (
    <OrderTable initialOrders={transformedOrders} totalCount={orders.length} />
  );
}
