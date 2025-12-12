import { getCouriers, getCourierStats } from "@/modules/courier/queries";
import { CourierClient } from "@/modules/courier/components/CourierClient";
import { Container } from "@/shared/ui/Container";

interface CouriersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sortBy?: string;
  }>;
}

export default async function CouriersPage({
  searchParams,
}: CouriersPageProps) {
  const params = await searchParams;
  const couriers = await getCouriers({
    search: params.search,
    status: params.status as "all" | "active" | "inactive" | undefined,
    sortBy: params.sortBy as "name" | "orders" | "createdAt" | undefined,
  });
  const stats = await getCourierStats();

  return (
    <Container>
      <CourierClient initialCouriers={couriers} stats={stats} />
    </Container>
  );
}
