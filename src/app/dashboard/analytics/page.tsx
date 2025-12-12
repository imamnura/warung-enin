import { getAdvancedAnalytics } from "@/modules/analytics/queries";
import { AnalyticsClient } from "@/modules/analytics/components/AnalyticsClient";

interface PageProps {
  searchParams: Promise<{
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Default to last 30 days
  const defaultDateTo = new Date().toISOString().split("T")[0];
  const defaultDateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const data = await getAdvancedAnalytics({
    dateFrom: params.dateFrom || defaultDateFrom,
    dateTo: params.dateTo || defaultDateTo,
  });

  return <AnalyticsClient data={data} />;
}
