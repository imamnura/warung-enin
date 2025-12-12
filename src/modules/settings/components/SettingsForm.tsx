"use client";

import { useState } from "react";
import { updateSettings } from "../actions";
import { Button } from "@/shared/ui/Button";

type Settings = {
  id: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string | null;
  storeLogo: string | null;
  deliveryRadius: number;
  deliveryFee: number;
  minOrder: number;
  taxPercentage: number;
  serviceCharge: number;
  whatsappNumber: string | null;
  whatsappEnabled: boolean;
  isOpen: boolean;
  openingHour: string;
  closingHour: string;
  gmapsUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  updatedAt: Date;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "store" | "delivery" | "payment" | "social"
  >("store");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateSettings(formData);

    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }

    setIsSubmitting(false);
  }

  const tabs = [
    { id: "store", label: "🏪 Informasi Toko", icon: "🏪" },
    { id: "delivery", label: "🚚 Pengiriman", icon: "🚚" },
    { id: "payment", label: "💳 Pembayaran & Biaya", icon: "💳" },
    { id: "social", label: "🌐 Media Sosial", icon: "🌐" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-red-500 text-red-600 bg-red-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Store Information Tab */}
          {activeTab === "store" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Toko *
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    defaultValue={settings.storeName}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    name="storePhone"
                    defaultValue={settings.storePhone}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="storeEmail"
                    defaultValue={settings.storeEmail || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    name="storeLogo"
                    defaultValue={settings.storeLogo || ""}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat Lengkap *
                </label>
                <textarea
                  name="storeAddress"
                  defaultValue={settings.storeAddress}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Buka *
                  </label>
                  <input
                    type="time"
                    name="openingHour"
                    defaultValue={settings.openingHour}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Tutup *
                  </label>
                  <input
                    type="time"
                    name="closingHour"
                    defaultValue={settings.closingHour}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isOpen"
                  name="isOpen"
                  defaultChecked={settings.isOpen}
                  value="true"
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="isOpen"
                  className="text-sm font-semibold text-gray-700"
                >
                  Toko Buka (Toggle untuk tutup sementara)
                </label>
              </div>
            </div>
          )}

          {/* Delivery Tab */}
          {activeTab === "delivery" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Radius Pengiriman (km) *
                  </label>
                  <input
                    type="number"
                    name="deliveryRadius"
                    defaultValue={settings.deliveryRadius}
                    required
                    min={0}
                    step={0.5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jarak maksimal pengiriman dari toko
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Biaya Pengiriman (Rp) *
                  </label>
                  <input
                    type="number"
                    name="deliveryFee"
                    defaultValue={settings.deliveryFee}
                    required
                    min={0}
                    step={1000}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Order (Rp) *
                  </label>
                  <input
                    type="number"
                    name="minOrder"
                    defaultValue={settings.minOrder}
                    required
                    min={0}
                    step={1000}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimal pembelian untuk bisa order
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pajak (%) *
                  </label>
                  <input
                    type="number"
                    name="taxPercentage"
                    defaultValue={settings.taxPercentage}
                    required
                    min={0}
                    max={100}
                    step={0.1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Persentase pajak dari subtotal (0 jika tidak ada)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Biaya Layanan (Rp) *
                  </label>
                  <input
                    type="number"
                    name="serviceCharge"
                    defaultValue={settings.serviceCharge}
                    required
                    min={0}
                    step={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Biaya layanan tetap per transaksi
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  💡 Informasi
                </h4>
                <p className="text-sm text-blue-700">
                  Total pembayaran = Subtotal + Pajak + Biaya Layanan + Ongkir -
                  Diskon
                </p>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    defaultValue={settings.whatsappNumber || ""}
                    placeholder="628123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 628xxx (tanpa +, spasi, atau tanda hubung)
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="whatsappEnabled"
                    name="whatsappEnabled"
                    defaultChecked={settings.whatsappEnabled}
                    value="true"
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="whatsappEnabled"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Aktifkan Notifikasi WhatsApp
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    name="gmapsUrl"
                    defaultValue={settings.gmapsUrl || ""}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagramUrl"
                    defaultValue={settings.instagramUrl || ""}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebookUrl"
                    defaultValue={settings.facebookUrl || ""}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "💾 Simpan Pengaturan"}
        </Button>
      </div>
    </form>
  );
}
