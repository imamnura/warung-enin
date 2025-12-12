import { getSettings } from "@/modules/settings/queries";
import { SettingsForm } from "@/modules/settings/components/SettingsForm";
import { StoreStatusToggle } from "@/modules/settings/components/StoreStatusToggle";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ⚙️ Pengaturan Toko
              </h1>
              <p className="text-gray-600">
                Kelola informasi dan konfigurasi toko Anda
              </p>
            </div>
            <StoreStatusToggle isOpen={settings.isOpen} />
          </div>
        </div>

        <SettingsForm settings={settings} />

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Catatan Penting</h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>Perubahan pengaturan akan berlaku segera setelah disimpan</li>
            <li>
              Status &quot;Tutup Toko&quot; akan menampilkan notifikasi untuk
              pelanggan
            </li>
            <li>Pastikan informasi kontak dan alamat selalu update</li>
            <li>
              Pengaturan biaya akan mempengaruhi perhitungan harga di checkout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
