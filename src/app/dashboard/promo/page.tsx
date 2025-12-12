import { getPromos } from "@/modules/promo/queries";
import { PromoList } from "@/modules/promo/components/PromoList";
import { PromoForm } from "@/modules/promo/components/PromoForm";

export default async function PromoPage() {
  const promos = await getPromos();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kelola Promo & Diskon
          </h1>
          <p className="text-gray-600">
            Buat dan kelola kode promo untuk pelanggan
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Buat Promo Baru
          </h2>
          <PromoForm />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar Promo</h2>
          <PromoList promos={promos} />
        </div>
      </div>
    </div>
  );
}
