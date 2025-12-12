"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = { question: string; answer: string };

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-foreground/10 rounded-md border border-foreground/10">
      {items.map((item, idx) => (
        <div key={idx}>
          <button
            className="flex w-full items-center justify-between px-4 py-3 text-left"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <span className="font-medium">{item.question}</span>
            <span>{open === idx ? "−" : "+"}</span>
          </button>
          <AnimatePresence initial={false}>
            {open === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-4 pb-4 text-sm text-foreground/80">{item.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

