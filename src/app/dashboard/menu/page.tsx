import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { MenuList } from "@/modules/menu/components/MenuList";
import { revalidatePath } from "next/cache";

export default async function MenuManagementPage() {
  const menus = await prisma.menu.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function deleteMenu(id: string) {
    "use server";
    await prisma.menu.delete({ where: { id } });
    revalidatePath("/dashboard/menu");
  }

  async function toggleAvailability(id: string, isAvailable: boolean) {
    "use server";
    await prisma.menu.update({
      where: { id },
      data: { isAvailable: !isAvailable },
    });
    revalidatePath("/dashboard/menu");
  }

  const menuData = menus.map((menu) => ({
    ...menu,
    price: menu.price.toString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Menu</h1>
          <p className="text-gray-600 mt-1">Kelola menu restoran Anda</p>
        </div>
        <Link href="/dashboard/menu/create">
          <Button variant="primary">+ Tambah Menu</Button>
        </Link>
      </div>

      <MenuList
        menus={menuData}
        onDelete={deleteMenu}
        onToggleAvailability={toggleAvailability}
      />
    </div>
  );
}
