"use client";

import { useState } from "react";
import { Container } from "@/shared/ui/Container";
import { UploadPaymentProof } from "@/modules/payment/components/UploadPaymentProof";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  deliveryMethod: string;
  deliveryAddress: string | null;
  createdAt: string;
  payment: {
    id: string;
    status: string;
    method: string;
    proofImage: string | null;
  } | null;
  courier: {
    name: string;
    phone: string;
    vehicleNumber: string | null;
  } | null;
};

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !phone) {
      setError("Mohon isi nomor pesanan dan nomor WhatsApp");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/track?orderNumber=${encodeURIComponent(
          orderNumber
        )}&phone=${encodeURIComponent(phone)}`
      );

      if (!response.ok) {
        const data = await response.json();
        setError(
          data.error ||
            "Pesanan tidak ditemukan. Periksa kembali nomor pesanan dan nomor WhatsApp Anda."
        );
        setOrder(null);
        return;
      }

      const result = await response.json();
      setOrder(result);
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  type Step =
    | "ORDERED"
    | "PAYMENT_PENDING"
    | "PROCESSED"
    | "ON_DELIVERY"
    | "READY"
    | "COMPLETED";
  type StepIcon =
    | typeof Package
    | typeof Clock
    | typeof Truck
    | typeof CheckCircle2;

  // Build steps based on delivery method
  const getSteps = (): { status: Step; label: string; icon: StepIcon }[] => {
    if (order?.deliveryMethod === "DIANTAR") {
      // For delivery: ORDERED -> PROCESSED -> ON_DELIVERY -> COMPLETED
      return [
        { status: "ORDERED", label: "Pesanan Diterima", icon: Package },
        { status: "PROCESSED", label: "Sedang Diproses", icon: Clock },
        { status: "ON_DELIVERY", label: "Dalam Pengiriman", icon: Truck },
        { status: "COMPLETED", label: "Selesai", icon: CheckCircle2 },
      ];
    } else {
      // For pickup: ORDERED -> PROCESSED -> READY -> COMPLETED
      return [
        { status: "ORDERED", label: "Pesanan Diterima", icon: Package },
        { status: "PROCESSED", label: "Sedang Diproses", icon: Clock },
        { status: "READY", label: "Siap Diambil", icon: Package },
        { status: "COMPLETED", label: "Selesai", icon: CheckCircle2 },
      ];
    }
  };

  const steps = getSteps();
  const currentIdx = order
    ? steps.findIndex((s) => s.status === order.status)
    : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Search className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Lacak Pesanan Anda
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Pantau status pesanan Anda secara real-time dengan memasukkan
              nomor pesanan dan WhatsApp
            </p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Pesanan
                </label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="WG-XXXXXX"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Lacak Pesanan
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/reservation"
                className="text-primary hover:text-secondary font-medium text-sm transition-colors"
              >
                ← Kembali ke Menu
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-12 space-y-6"
          >
            {/* Order Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order {order.orderNumber}
                  </h2>
                  <p className="text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">
                    Total Pembayaran
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Rp {Number(order.totalPrice).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="mb-8">
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentIdx + 1) / steps.length) * 100}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative grid grid-cols-4 gap-4">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index <= currentIdx;
                      const isCurrent = index === currentIdx;

                      return (
                        <div
                          key={step.status}
                          className="flex flex-col items-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                              isActive
                                ? "bg-gradient-to-br from-primary to-secondary shadow-lg"
                                : "bg-gray-200"
                            } ${isCurrent ? "ring-4 ring-primary/30" : ""}`}
                          >
                            <Icon
                              className={`w-8 h-8 ${
                                isActive ? "text-white" : "text-gray-400"
                              }`}
                            />
                          </motion.div>
                          <div
                            className={`text-center text-sm font-medium ${
                              isActive ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">
                      Metode Pengiriman
                    </div>
                    <div className="text-gray-900 font-medium">
                      {order.deliveryMethod}
                    </div>
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="flex items-start gap-3">
                    <div className="bg-green-50 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700">
                        Alamat Pengiriman
                      </div>
                      <div className="text-gray-900">
                        {order.deliveryAddress}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Payment Proof - Show untuk transfer belum upload bukti */}
            {order.payment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <UploadPaymentProof
                  orderId={order.id}
                  currentProofImage={order.payment.proofImage}
                  paymentStatus={order.payment.status}
                  paymentMethod={order.payment.method}
                />
              </motion.div>
            )}

            {/* Courier Info */}
            {order.courier && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white p-4 rounded-full shadow-md">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Informasi Kurir
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4" />
                        <span className="font-medium">
                          {order.courier.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4" />
                        <span>{order.courier.phone}</span>
                      </div>
                      {order.courier.vehicleNumber && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Truck className="w-4 h-4" />
                          <span>{order.courier.vehicleNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </Container>
    </div>
  );
}
