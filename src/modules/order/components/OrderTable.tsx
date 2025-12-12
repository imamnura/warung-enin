"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProcessOrderModal } from "@/modules/order/components/ProcessOrderModal";
import { AssignCourierModal } from "@/modules/order/components/AssignCourierModal";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { ExportButton } from "@/shared/ui/ExportButton";
import {
  exportToCSV,
  exportToPDF,
  formatTableForPDF,
} from "@/shared/utils/export";

type OrderStatus =
  | "ORDERED"
  | "PAYMENT_PENDING"
  | "PROCESSED"
  | "ON_DELIVERY"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";
type DeliveryMethod = "DIANTAR" | "AMBIL_SENDIRI";

interface Order {
  id: string;
  orderNumber: string;
  customer: { name: string; phone: string };
  courier: { name: string } | null;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  totalPrice: number;
  courierId: string | null;
  createdAt: string;
}

interface OrderTableProps {
  initialOrders: Order[];
  totalCount: number;
}

export function OrderTable({ initialOrders, totalCount }: OrderTableProps) {
  const [orders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const itemsPerPage = 10;

  // Apply filters and search
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customer.phone.includes(searchQuery)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, orders]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleProcessOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowProcessModal(true);
  };

  const handleAssignCourier = (order: Order) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
  };

  const refreshOrders = async () => {
    // Refresh data from server
    window.location.reload();
  };

  const handleExportCSV = () => {
    const csvData = filteredOrders.map((order) => ({
      "No. Order": order.orderNumber,
      Customer: order.customer.name,
      Telepon: order.customer.phone,
      Total: order.totalPrice,
      Status: order.status,
      Pengiriman: order.deliveryMethod === "DIANTAR" ? "Delivery" : "Take Away",
      Kurir: order.courier?.name || "-",
      Tanggal: new Date(order.createdAt).toLocaleDateString("id-ID"),
    }));
    exportToCSV(csvData, `pesanan_${new Date().toISOString().split("T")[0]}`);
  };

  const handleExportPDF = () => {
    const headers = [
      "No. Order",
      "Customer",
      "Total",
      "Status",
      "Pengiriman",
      "Kurir",
      "Tanggal",
    ];
    const rows = filteredOrders.map((order) => [
      order.orderNumber,
      order.customer.name,
      `Rp ${order.totalPrice.toLocaleString("id-ID")}`,
      order.status,
      order.deliveryMethod === "DIANTAR" ? "Delivery" : "Take Away",
      order.courier?.name || "-",
      new Date(order.createdAt).toLocaleDateString("id-ID"),
    ]);
    const content = formatTableForPDF("Laporan Pesanan", headers, rows);
    exportToPDF(content, `pesanan_${new Date().toISOString().split("T")[0]}`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const colors: Record<
      OrderStatus,
      "primary" | "warning" | "success" | "danger"
    > = {
      ORDERED: "warning",
      PAYMENT_PENDING: "warning",
      PROCESSED: "warning",
      ON_DELIVERY: "primary",
      READY: "primary",
      COMPLETED: "success",
      CANCELLED: "danger",
    };

    const labels: Record<OrderStatus, string> = {
      ORDERED: "Pesanan Masuk",
      PAYMENT_PENDING: "Menunggu Pembayaran",
      PROCESSED: "Diproses",
      ON_DELIVERY: "Dikirim",
      READY: "Siap",
      COMPLETED: "Selesai",
      CANCELLED: "Dibatalkan",
    };

    return <Badge color={colors[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Total {totalCount} pesanan</p>
        </div>
        <ExportButton
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          label="Export Data"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-card p-4 space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Cari order number, nama, atau nomor HP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              statusFilter === "ALL"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md"
                : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Semua Status
          </button>
          {(
            [
              "ORDERED",
              "PROCESSED",
              "ON_DELIVERY",
              "READY",
              "COMPLETED",
            ] as const
          ).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {status === "ORDERED" && "Pesanan Masuk"}
              {status === "PROCESSED" && "Diproses"}
              {status === "ON_DELIVERY" && "Dikirim"}
              {status === "READY" && "Siap"}
              {status === "COMPLETED" && "Selesai"}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600">
          Menampilkan {filteredOrders.length} pesanan
        </p>
      </div>

      {/* Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengiriman
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurir
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/dashboard/orders/${order.id}`)
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-primary hover:text-primary-600 font-medium"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {order.totalPrice.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.deliveryMethod === "DIANTAR"
                      ? "Delivery"
                      : "Take Away"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.courier?.name || "-"}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      {order.deliveryMethod === "DIANTAR" &&
                        !order.courierId && (
                          <Button
                            onClick={() => handleAssignCourier(order)}
                            variant="outline"
                            className="text-xs"
                          >
                            Assign Kurir
                          </Button>
                        )}
                      <Button
                        onClick={() => handleProcessOrder(order)}
                        className="text-xs bg-gradient-primary"
                      >
                        Proses
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {paginatedOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  {order.orderNumber}
                </Link>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div>
                <span className="text-gray-600">Pelanggan:</span>{" "}
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>{" "}
                <span className="font-medium">
                  Rp {order.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Pengiriman:</span>{" "}
                {order.deliveryMethod === "DIANTAR" ? "Delivery" : "Take Away"}
              </div>
              {order.deliveryMethod === "DIANTAR" && (
                <div>
                  <span className="text-gray-600">Kurir:</span>{" "}
                  {order.courier?.name || "-"}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {order.deliveryMethod === "DIANTAR" && !order.courierId && (
                <Button
                  onClick={() => handleAssignCourier(order)}
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  Assign Kurir
                </Button>
              )}
              <Button
                onClick={() => handleProcessOrder(order)}
                className="flex-1 text-xs bg-gradient-primary"
              >
                Proses
              </Button>
              <Link href={`/dashboard/orders/${order.id}`} className="flex-1">
                <Button variant="outline" className="w-full text-xs">
                  Detail
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="text-sm"
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                className="text-sm"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedOrder && (
        <>
          <ProcessOrderModal
            isOpen={showProcessModal}
            onClose={() => {
              setShowProcessModal(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
            onUpdate={refreshOrders}
          />
          <AssignCourierModal
            isOpen={showAssignModal}
            onClose={() => {
              setShowAssignModal(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
            onUpdate={refreshOrders}
          />
        </>
      )}
    </div>
  );
}
