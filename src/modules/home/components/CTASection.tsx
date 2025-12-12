"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-600 via-red-500 to-yellow-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Lapar? Pesan Sekarang!
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Nikmati hidangan lezat dari Warung Enin dengan mudah dan cepat
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/reservation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-bold shadow-2xl hover:shadow-3xl transition-all"
              >
                🛒 Pesan Online Sekarang
              </motion.button>
            </Link>
            <a
              href="https://wa.me/62XXXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2"
              >
                <span>💬</span> Pesan via WhatsApp
              </motion.button>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-white font-bold text-lg mb-2">
                Pengiriman Cepat
              </h3>
              <p className="text-white/80">Maksimal 30 menit sampai</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-3">💯</div>
              <h3 className="text-white font-bold text-lg mb-2">100% Fresh</h3>
              <p className="text-white/80">Menu fresh setiap hari</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-white font-bold text-lg mb-2">
                Promo Spesial
              </h3>
              <p className="text-white/80">Diskon untuk pelanggan setia</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
