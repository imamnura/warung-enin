"use client";

import { motion } from "framer-motion";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      rating: 5,
      comment:
        "Enak banget! Ayam penyet nya juara, sambelnya maknyos. Recommended!",
      avatar: "👨",
      date: "2 hari yang lalu",
    },
    {
      id: 2,
      name: "Siti Rahayu",
      rating: 5,
      comment:
        "Bakso nya enak, kuahnya berasa banget. Delivery cepat dan ramah.",
      avatar: "👩",
      date: "1 minggu yang lalu",
    },
    {
      id: 3,
      name: "Ahmad Ridwan",
      rating: 5,
      comment: "Soto ayam nya mantap! Harga terjangkau, porsi banyak. Puas!",
      avatar: "👨",
      date: "2 minggu yang lalu",
    },
    {
      id: 4,
      name: "Dewi Lestari",
      rating: 4,
      comment:
        "Menu nya banyak pilihan, semua enak. Jadi langganan setiap hari!",
      avatar: "👩",
      date: "3 minggu yang lalu",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Kata Pelanggan Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dengarkan pengalaman pelanggan yang puas dengan Warung Enin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <div className="flex text-yellow-500">
                    {"⭐".repeat(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-3 italic">
                &ldquo;{testimonial.comment}&rdquo;
              </p>
              <p className="text-sm text-gray-400">{testimonial.date}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-block bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-1">
            <div className="bg-white rounded-full px-8 py-4">
              <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                4.8/5.0 ⭐
              </p>
              <p className="text-gray-600 text-sm">
                Dari 500+ review pelanggan
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
