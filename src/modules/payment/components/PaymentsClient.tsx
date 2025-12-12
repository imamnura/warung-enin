"use client";

import { useState } from "react";
import { PaymentFilters } from "@/modules/payment/components/PaymentFilters";
import { PaymentStats } from "@/modules/payment/components/PaymentStats";
import { PaymentTable } from "@/modules/payment/components/PaymentTable";
import { ExportButton } from "@/shared/ui/ExportButton";
import { Button } from "@/shared/ui/Button";
import { exportPaymentsToCSV } from "@/modules/payment/actions";
import { exportToPDF, formatTableForPDF } from "@/shared/utils/export";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaymentsClientProps {
  initialPayments: Array<{
    id: string;
    transactionId: string | null;
    status:
      | "PENDING"
      | "VERIFIED"
      | "PAID"
      | "HANDED_OVER"
      | "FAILED"
      | "REFUNDED";
    method: string;
    amount: number;
    createdAt: Date;
    paidAt: Date | null;
    order: {
      orderNumber: string;
      customer: {
        name: string;
        phone: string | null;
      };
    };
  }>;
  stats: {
    totalPayments: number;
    pendingPayments: number;
    paidPayments: number;
    failedPayments: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    methodBreakdown: Record<string, { count: number; amount: number }>;
  };
}

export function PaymentsClient({
  initialPayments,
  stats,
}: PaymentsClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter state
  const [filters, setFilters] = useState({
    status: "",
    method: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  // Client-side filtering
  const filteredPayments = initialPayments.filter((payment) => {
    // Status filter
    if (filters.status && payment.status !== filters.status) {
      return false;
    }

    // Method filter
    if (filters.method && payment.method !== filters.method) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      const paymentDate = new Date(payment.createdAt);
      paymentDate.setHours(0, 0, 0, 0);
      if (paymentDate < fromDate) {
        return false;
      }
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      const paymentDate = new Date(payment.createdAt);
      if (paymentDate > toDate) {
        return false;
      }
    }

    // Search filter (transaction ID, order number, customer name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTransactionId = payment.transactionId
        ?.toLowerCase()
        .includes(searchLower);
      const matchesOrderNumber = payment.order.orderNumber
        .toLowerCase()
        .includes(searchLower);
      const matchesCustomerName = payment.order.customer.name
        .toLowerCase()
        .includes(searchLower);

      if (
        !matchesTransactionId &&
        !matchesOrderNumber &&
        !matchesCustomerName
      ) {
        return false;
      }
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleFilterChange = (newFilters: {
    status: string;
    method: string;
    dateFrom: string;
    dateTo: string;
    search: string;
  }) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  const handleExportCSV = async () => {
    try {
      const currentParams = new URLSearchParams(window.location.search);
      const filters = {
        status: currentParams.get("status") as
          | "PENDING"
          | "PAID"
          | "FAILED"
          | "REFUNDED"
          | undefined,
        method: currentParams.get("method") || undefined,
        dateFrom: currentParams.get("dateFrom") || undefined,
        dateTo: currentParams.get("dateTo") || undefined,
        search: currentParams.get("search") || undefined,
      };

      const csvContent = await exportPaymentsToCSV(filters);
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Data pembayaran berhasil diexport");
    } catch (error) {
      toast.error("Gagal export data pembayaran");
      console.error("Export error:", error);
    }
  };

  const handleExportPDF = () => {
    const headers = [
      "Transaksi ID",
      "Order",
      "Customer",
      "Metode",
      "Amount",
      "Status",
      "Tanggal",
    ];
    const rows = filteredPayments.map((payment) => [
      payment.transactionId || "-",
      payment.order.orderNumber,
      payment.order.customer.name,
      payment.method,
      `Rp ${payment.amount.toLocaleString("id-ID")}`,
      payment.status,
      new Date(payment.createdAt).toLocaleDateString("id-ID"),
    ]);
    const content = formatTableForPDF("Laporan Pembayaran", headers, rows);
    exportToPDF(content, `payments_${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Rekonsiliasi Pembayaran
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola dan pantau semua transaksi pembayaran
          </p>
        </div>
        <ExportButton
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          label="Export Data"
        />
      </div>

      <PaymentStats stats={stats} />

      <PaymentFilters onFilterChange={handleFilterChange} />

      {filteredPayments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Tidak ada pembayaran ditemukan</p>
        </div>
      ) : (
        <>
          <PaymentTable payments={paginatedPayments} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {startIndex + 1} -{" "}
                  {Math.min(endIndex, filteredPayments.length)} dari{" "}
                  {filteredPayments.length} pembayaran
                  {filteredPayments.length !== initialPayments.length && (
                    <span className="text-gray-400 ml-1">
                      (dari total {initialPayments.length})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-slate-400"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page as number)}
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
