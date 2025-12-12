"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Promo = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_DELIVERY";
  value: { toString(): string };
  minPurchase: { toString(): string };
};

export function ActivePromosSection({ promos }: { promos: Promo[] }) {
  if (promos.length === 0) return null;

  function getPromoLabel(promo: Promo) {
    if (promo.type === "FREE_DELIVERY") return "GRATIS ONGKIR";
    const value = Number(promo.value);
    if (promo.type === "PERCENTAGE") return `DISKON ${value}%`;
    return `DISKON Rp ${(value / 1000).toFixed(0)}K`;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎁 Promo Spesial Hari Ini
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jangan lewatkan penawaran menarik untuk pesanan Anda!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {promos.slice(0, 3).map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-yellow-400 hover:shadow-2xl transition-shadow"
            >
              <div className="bg-gradient-to-r from-red-600 to-yellow-500 px-6 py-4">
                <p className="text-white text-sm font-semibold mb-1">
                  KODE PROMO
                </p>
                <p className="text-white text-3xl font-bold font-mono tracking-wider">
                  {promo.code}
                </p>
              </div>
              <div className="p-6">
                <div className="bg-yellow-100 text-yellow-800 text-center py-2 px-4 rounded-lg font-bold text-lg mb-4">
                  {getPromoLabel(promo)}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{promo.name}</h3>
                {promo.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {promo.description}
                  </p>
                )}
                {Number(promo.minPurchase) > 0 && (
                  <p className="text-xs text-gray-500">
                    Min. belanja: Rp{" "}
                    {Number(promo.minPurchase).toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link href="/reservation">
            <button className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transition-all">
              Gunakan Promo Sekarang →
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
