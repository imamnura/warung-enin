import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MenuEditForm } from "@/modules/menu/components/MenuEditForm";

export default async function MenuEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const menu = await prisma.menu.findUnique({
    where: { id },
  });

  if (!menu) {
    notFound();
  }

  const menuData = {
    id: menu.id,
    name: menu.name,
    description: menu.description || "",
    price: menu.price.toString(),
    category: menu.category,
    images: menu.images,
    isAvailable: menu.isAvailable,
    stock: menu.stock,
    prepTime: menu.prepTime,
    spicyLevel: menu.spicyLevel,
    isPopular: menu.isPopular,
  };

  return <MenuEditForm menu={menuData} />;
}
