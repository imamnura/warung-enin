"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnalyticsFilters } from "@/modules/analytics/components/AnalyticsFilters";
import { AnalyticsSummary } from "@/modules/analytics/components/AnalyticsSummary";
import {
  RevenueChart,
  OrderStatusChart,
  PaymentMethodChart,
  CategoryPerformanceChart,
} from "@/modules/analytics/components/AnalyticsCharts";
import {
  TopProductsTable,
  TopCustomersTable,
} from "@/modules/analytics/components/AnalyticsTables";
import { InsightsCard } from "@/modules/analytics/components/InsightsCard";
import { Button } from "@/shared/ui/Button";
import { exportAnalyticsToCSV } from "@/modules/analytics/queries";
import { toast } from "sonner";

interface AnalyticsClientProps {
  data: {
    summary: {
      totalRevenue: number;
      totalOrders: number;
      completedOrders: number;
      cancelledOrders: number;
      averageOrderValue: number;
      newCustomers: number;
      activeCustomers: number;
    };
    trends: {
      revenue: Array<{ date: string; revenue: number }>;
      ordersByStatus: Record<string, number>;
      paymentsByMethod: Record<string, number>;
      ordersByDelivery: Record<string, number>;
    };
    products: {
      topProducts: Array<{
        menuId: string;
        name: string;
        category: string;
        quantity: number;
        revenue: number;
        orders: number;
      }>;
      categoryPerformance: Record<
        string,
        { revenue: number; quantity: number; orders: number }
      >;
    };
    customers: {
      topCustomers: Array<{
        id: string;
        name: string;
        totalSpent: number;
        orderCount: number;
      }>;
      newCustomers: number;
      activeCustomers: number;
    };
    insights: {
      peakHours: Array<{ hour: number; count: number }>;
    };
  };
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [exporting, setExporting] = useState(false);

  const handleFilterChange = (filters: {
    dateFrom: string;
    dateTo: string;
  }) => {
    startTransition(() => {
      const params = new URLSearchParams();
      params.set("dateFrom", filters.dateFrom);
      params.set("dateTo", filters.dateTo);
      router.push(`/dashboard/analytics?${params.toString()}`);
    });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const currentParams = new URLSearchParams(window.location.search);
      const filters = {
        dateFrom: currentParams.get("dateFrom") || undefined,
        dateTo: currentParams.get("dateTo") || undefined,
      };

      const csvData = await exportAnalyticsToCSV(filters);

      // Download summary
      const summaryBlob = new Blob([csvData.summary], { type: "text/csv" });
      const summaryUrl = window.URL.createObjectURL(summaryBlob);
      const summaryLink = document.createElement("a");
      summaryLink.href = summaryUrl;
      summaryLink.download = `analytics-summary-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(summaryLink);
      summaryLink.click();
      document.body.removeChild(summaryLink);
      window.URL.revokeObjectURL(summaryUrl);

      // Download products
      const productsBlob = new Blob([csvData.products], { type: "text/csv" });
      const productsUrl = window.URL.createObjectURL(productsBlob);
      const productsLink = document.createElement("a");
      productsLink.href = productsUrl;
      productsLink.download = `top-products-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(productsLink);
      productsLink.click();
      document.body.removeChild(productsLink);
      window.URL.revokeObjectURL(productsUrl);

      // Download customers
      const customersBlob = new Blob([csvData.customers], {
        type: "text/csv",
      });
      const customersUrl = window.URL.createObjectURL(customersBlob);
      const customersLink = document.createElement("a");
      customersLink.href = customersUrl;
      customersLink.download = `top-customers-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(customersLink);
      customersLink.click();
      document.body.removeChild(customersLink);
      window.URL.revokeObjectURL(customersUrl);

      toast.success("Data analytics berhasil diexport");
    } catch (error) {
      toast.error("Gagal export data analytics");
      console.error("Export error:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Advanced Analytics & Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Analisis mendalam performa bisnis Warung Enin
          </p>
        </div>
        <Button onClick={handleExport} disabled={exporting} variant="outline">
          {exporting ? "Mengexport..." : "📥 Export Reports"}
        </Button>
      </div>

      <AnalyticsFilters onFilterChange={handleFilterChange} />

      {isPending ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      ) : (
        <>
          <AnalyticsSummary summary={data.summary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={data.trends.revenue} />
            <OrderStatusChart data={data.trends.ordersByStatus} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentMethodChart data={data.trends.paymentsByMethod} />
            <CategoryPerformanceChart
              data={data.products.categoryPerformance}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TopProductsTable products={data.products.topProducts} />
            </div>
            <InsightsCard insights={data.insights} />
          </div>

          <TopCustomersTable customers={data.customers.topCustomers} />
        </>
      )}
    </div>
  );
}
