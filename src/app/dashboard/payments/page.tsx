import { getPayments, getPaymentStats } from "@/modules/payment/actions";
import { PaymentsClient } from "@/modules/payment/components/PaymentsClient";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    method?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }>;
}

export default async function PaymentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const payments = await getPayments({
    status: params.status as
      | "PENDING"
      | "PAID"
      | "FAILED"
      | "REFUNDED"
      | undefined,
    method: params.method,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    search: params.search,
  });

  const stats = await getPaymentStats({
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  });

  return <PaymentsClient initialPayments={payments} stats={stats} />;
}
