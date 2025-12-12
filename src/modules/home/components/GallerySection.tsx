"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const galleryImages = [
  { id: 1, title: "Nasi Ayam Penyet", category: "Menu" },
  { id: 2, title: "Bakso Spesial", category: "Menu" },
  { id: 3, title: "Soto Ayam", category: "Menu" },
  { id: 4, title: "Warung Enin", category: "Store" },
  { id: 5, title: "Mie Goreng", category: "Menu" },
  { id: 6, title: "Es Jeruk", category: "Minuman" },
];

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Menu", "Store", "Minuman"];

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Galeri Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lihat foto-foto menu dan suasana Warung Enin
          </p>
        </motion.div>

        {/* Filter Categories */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
            >
              <div className="w-full h-full bg-gradient-to-br from-red-100 to-yellow-100 flex items-center justify-center">
                <span className="text-8xl">
                  {image.category === "Menu"
                    ? "🍽️"
                    : image.category === "Store"
                    ? "🏪"
                    : "🥤"}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-sm font-semibold text-yellow-400 mb-1">
                    {image.category}
                  </p>
                  <h3 className="text-xl font-bold">{image.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
