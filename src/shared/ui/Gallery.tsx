"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export function Gallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((img, i) => (
        <motion.div
          key={img.src}
          className="relative overflow-hidden rounded-md h-36 sm:h-44"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        </motion.div>
      ))}
    </div>
  );
}
