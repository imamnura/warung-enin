"use client";

import { motion } from "framer-motion";

export function OperatingHours() {
  const schedule = [
    { day: "Senin - Jumat", hours: "08:00 - 21:00", isOpen: true },
    { day: "Sabtu - Minggu", hours: "08:00 - 22:00", isOpen: true },
    { day: "Libur Nasional", hours: "10:00 - 20:00", isOpen: true },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-red-600 via-red-500 to-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Jam Operasional
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Kami buka setiap hari untuk melayani Anda dengan sepenuh hati
            </p>

            <div className="space-y-4">
              {schedule.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {item.day}
                    </p>
                    <p className="text-yellow-200 font-bold text-xl">
                      {item.hours}
                    </p>
                  </div>
                  {item.isOpen && (
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Buka
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              📍 Lokasi Kami
            </h3>
            <div className="space-y-4 text-white">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏠</span>
                <div>
                  <p className="font-semibold">Alamat</p>
                  <p className="text-white/90">
                    Taraju, Kabupaten Tasikmalaya, Jawa Barat
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-white/90">+62 xxx-xxxx-xxxx</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛵</span>
                <div>
                  <p className="font-semibold">Delivery Area</p>
                  <p className="text-white/90">Radius 5 km dari lokasi</p>
                </div>
              </div>
            </div>

            <div className="mt-6 aspect-video bg-white/20 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.60373622429!2d108.1959!3d-7.3506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f50e0c1d64b05%3A0x401e8f1fc28b7b0!2sTasikmalaya%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
