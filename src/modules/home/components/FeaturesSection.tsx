"use client";

import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      icon: "🛒",
      title: "Pesan Online",
      description: "Pesan kapan saja, dimana saja dengan mudah melalui website",
    },
    {
      icon: "🏍️",
      title: "Delivery Cepat",
      description: "Pengiriman cepat ke lokasi Anda dengan kurir terpercaya",
    },
    {
      icon: "💳",
      title: "Pembayaran Mudah",
      description: "QRIS, GoPay, ShopeePay, OVO, atau Cash on Delivery",
    },
    {
      icon: "⭐",
      title: "Kualitas Terjamin",
      description: "Menu fresh setiap hari dengan bahan berkualitas",
    },
    {
      icon: "📱",
      title: "Tracking Real-time",
      description: "Pantau status pesanan Anda secara real-time",
    },
    {
      icon: "🎁",
      title: "Promo Menarik",
      description: "Dapatkan promo dan diskon spesial untuk Anda",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Kenapa Pilih Warung Enin?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kami memberikan pelayanan terbaik untuk kepuasan Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-red-50 hover:to-yellow-50 transition-all duration-300"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
