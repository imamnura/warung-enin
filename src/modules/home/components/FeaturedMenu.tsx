"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/shared/utils/price";
import { Badge } from "@/shared/ui/Badge";

interface FeaturedMenuProps {
  menus: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    images: string[];
    isPopular: boolean;
    isAvailable: boolean;
  }>;
}

export function FeaturedMenu({ menus }: FeaturedMenuProps) {
  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Menu Pilihan Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dipilih khusus untuk Anda, menu terbaik dengan cita rasa yang
            autentik
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menus.map((menu, index) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/menu/${menu.id}`}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <div className="relative aspect-square">
                    {menu.images[0] ? (
                      <Image
                        src={menu.images[0]}
                        alt={menu.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-100 to-yellow-100 flex items-center justify-center">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                    {menu.isPopular && (
                      <div className="absolute top-2 right-2">
                        <Badge color="best">⭐ Popular</Badge>
                      </div>
                    )}
                    {!menu.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge color="destructive">Habis</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <Badge color="primary" className="mb-2">
                      {menu.category}
                    </Badge>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {menu.name}
                    </h3>
                    <p className="text-2xl font-bold text-red-600">
                      {formatPrice(menu.price)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/reservation">
            <button className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
              Lihat Semua Menu →
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
