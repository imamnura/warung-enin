"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { createCourier, updateCourier, CourierFormData } from "../actions";

interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: string | null;
  vehicleNumber: string | null;
  address: string | null;
  idCard: string | null;
  isActive: boolean;
}

interface CourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  courier?: Courier | null;
  onSuccess: () => void;
}

export function CourierModal({
  isOpen,
  onClose,
  courier,
  onSuccess,
}: CourierModalProps) {
  const [formData, setFormData] = useState<CourierFormData>({
    name: "",
    phone: "",
    vehicle: "",
    vehicleNumber: "",
    address: "",
    idCard: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (courier) {
      setFormData({
        name: courier.name,
        phone: courier.phone,
        vehicle: courier.vehicle || "",
        vehicleNumber: courier.vehicleNumber || "",
        address: courier.address || "",
        idCard: courier.idCard || "",
        isActive: courier.isActive,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        vehicle: "",
        vehicleNumber: "",
        address: "",
        idCard: "",
        isActive: true,
      });
    }
    setError("");
  }, [courier, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let result;
      if (courier) {
        result = await updateCourier(courier.id, formData);
      } else {
        result = await createCourier(formData);
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "Terjadi kesalahan");
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                <h2 className="text-2xl font-bold text-slate-900">
                  {courier ? "Edit Kurir" : "Tambah Kurir Baru"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6 overflow-y-auto flex-1"
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Informasi Dasar
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nama Kurir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                      placeholder="Masukkan nama kurir"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Informasi Kendaraan
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Jenis Kendaraan
                      </label>
                      <input
                        type="text"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        placeholder="Motor / Mobil"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nomor Plat
                      </label>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                        placeholder="B 1234 XYZ"
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Informasi Pribadi
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nomor KTP
                    </label>
                    <input
                      type="text"
                      name="idCard"
                      value={formData.idCard}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                      placeholder="16 digit nomor KTP"
                      maxLength={16}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-slate-700">
                    Kurir Aktif (dapat menerima pesanan)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {courier ? "Update" : "Simpan"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
