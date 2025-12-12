import { getCustomers, getCustomerStats } from "@/modules/customer/queries";
import { CustomersClient } from "@/modules/customer/components/CustomersClient";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const customers = await getCustomers({
    search: params.search,
    sortBy:
      (params.sortBy as "name" | "orders" | "totalSpent" | "lastOrder") ||
      "name",
    sortOrder: (params.sortOrder as "asc" | "desc") || "asc",
  });

  const stats = await getCustomerStats();

  return <CustomersClient initialCustomers={customers} stats={stats} />;
}
