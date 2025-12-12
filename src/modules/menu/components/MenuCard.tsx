"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { SPICY_LEVELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils/currency";

export type MenuCardProps = {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  spicyLevel: number;
  isPopular: boolean;
  onOrder?: (menuId: string) => void;
};

export function MenuCard({
  id,
  name,
  description,
  price,
  images,
  spicyLevel,
  isPopular,
  onOrder,
}: MenuCardProps) {
  const imageUrl = images && images.length > 0 ? images[0] : "/placeholder.jpg";
  const spicy = SPICY_LEVELS.find((s) => s.value === spicyLevel);

  return (
    <motion.div
      className="rounded-lg border border-foreground/10 bg-white shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative h-40 w-full">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="rounded-t-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold flex-1">{name}</h3>
          {isPopular && <Badge color="primary">Populer</Badge>}
        </div>
        {description && (
          <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-600">
            {formatCurrency(price)}
          </span>
          {spicy && spicyLevel > 0 && (
            <span className="text-sm" title={spicy.label}>
              {spicy.emoji}
            </span>
          )}
        </div>
        <Button
          variant="primary"
          onClick={() => onOrder?.(id)}
          className="w-full"
        >
          Pesan
        </Button>
      </div>
    </motion.div>
  );
}
