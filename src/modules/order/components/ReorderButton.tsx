"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/shared/ui/Button";
import { reorderItems } from "@/modules/order/queries";
import { useCartStore } from "@/modules/order/store";

type ReorderButtonProps = {
  orderId: string;
};

export function ReorderButton({ orderId }: ReorderButtonProps) {
  const router = useRouter();
  const { clearCart, addItem } = useCartStore();

  const handleReorder = async () => {
    try {
      const result = await reorderItems(orderId, "");

      if (!result.success || !result.items) {
        toast.error(result.error || "Gagal memuat ulang pesanan");
        return;
      }

      // Clear current cart
      clearCart();

      // Add items to cart
      result.items.forEach((item) => {
        addItem({
          menuId: item.menuId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        });
      });

      toast.success(
        `${result.items.length} item telah ditambahkan ke keranjang`
      );

      // Redirect to reservation page
      router.push("/reservation");
    } catch (error) {
      console.error("Reorder error:", error);
      toast.error("Terjadi kesalahan saat memuat ulang pesanan");
    }
  };

  return (
    <Button onClick={handleReorder} className="flex-1">
      Pesan Lagi
    </Button>
  );
}
