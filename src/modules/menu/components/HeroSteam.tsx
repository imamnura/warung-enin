"use client";
import { motion } from "framer-motion";

export function HeroSteam() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-white/40 blur-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0.2, 0.6, 0], y: [-10, -40, -60] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          style={{ bottom: 40 + i * 10 }}
        />
      ))}
    </div>
  );
}

