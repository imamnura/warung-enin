"use client";
import { useMemo, useState } from "react";
import { MenuCard } from "./MenuCard";
import { Button } from "@/shared/ui/Button";
import { MENU_CATEGORIES, type MenuCategoryKey } from "@/lib/constants";
import type { Menu } from "@/generated/prisma/client";

const tabs = [
  "ALL",
  "NASI",
  "LAUK",
  "BAKSO",
  "SOTO",
  "AYAM",
  "MIE",
  "MINUMAN",
] as const;
type Tab = (typeof tabs)[number];

export function MenuGrid({ menus }: { menus: Menu[] }) {
  const [active, setActive] = useState<Tab>("ALL");

  const filtered = useMemo(
    () =>
      active === "ALL" ? menus : menus.filter((m) => m.category === active),
    [active, menus]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={active === "ALL" ? "primary" : "ghost"}
          onClick={() => setActive("ALL")}
        >
          Semua Menu
        </Button>
        {tabs.slice(1).map((cat) => (
          <Button
            key={cat}
            variant={active === cat ? "primary" : "ghost"}
            onClick={() => setActive(cat)}
          >
            {MENU_CATEGORIES[cat as MenuCategoryKey]?.label || cat}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          <p>Tidak ada menu dalam kategori ini</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <MenuCard
              key={m.id}
              id={m.id}
              name={m.name}
              description={m.description || undefined}
              price={Number(m.price)}
              images={m.images}
              spicyLevel={m.spicyLevel}
              isPopular={m.isPopular}
              onOrder={() => {
                window.location.href = `/reservation?menu=${m.id}`;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
