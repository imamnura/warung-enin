"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MenuCategory } from "@/generated/prisma/enums";
import { menuFormSchema, type MenuFormValues } from "@/modules/menu/schema";
import { updateMenu } from "@/modules/menu/actions";
import { Button } from "@/shared/ui/Button";
import { ImageUploader } from "@/shared/ui/ImageUploader";

type MenuEditFormProps = {
  menu: {
    id: string;
    name: string;
    description: string;
    price: string;
    category: MenuCategory;
    images: string[];
    isAvailable: boolean;
    stock: number | null;
    prepTime: number | null;
    spicyLevel: number | null;
    isPopular: boolean;
  };
};

export function MenuEditForm({ menu }: MenuEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: menu.name,
      description: menu.description,
      price: menu.price,
      category: menu.category,
      images: menu.images,
      isAvailable: menu.isAvailable,
      stock: menu.stock?.toString() || "",
      prepTime: menu.prepTime?.toString() || "",
      spicyLevel: menu.spicyLevel?.toString() || "",
      isPopular: menu.isPopular,
    },
  });

  const images = watch("images");

  const onSubmit = async (data: MenuFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("images", JSON.stringify(data.images));
      formData.append("isAvailable", String(data.isAvailable));
      formData.append("stock", data.stock || "");
      formData.append("prepTime", data.prepTime || "");
      formData.append("spicyLevel", data.spicyLevel || "");
      formData.append("isPopular", String(data.isPopular));

      const result = await updateMenu(menu.id, formData);

      if (result.success) {
        toast.success("Menu berhasil diupdate!");
        router.push("/dashboard/menu");
      } else {
        toast.error("Gagal mengupdate menu. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error updating menu:", error);
      toast.error("Gagal mengupdate menu. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Menu</h1>
          <p className="text-gray-600 mt-1">
            Update informasi menu {menu.name}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-card p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Nasi Ayam Penyet"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Deskripsikan menu..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("price")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="15000"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Pilih kategori</option>
                {Object.values(MenuCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok
              </label>
              <input
                type="number"
                {...register("stock")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="50"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Prep Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waktu Persiapan (menit)
              </label>
              <input
                type="number"
                {...register("prepTime")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="15"
              />
              {errors.prepTime && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.prepTime.message}
                </p>
              )}
            </div>

            {/* Spicy Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level Pedas (0-5)
              </label>
              <input
                type="number"
                {...register("spicyLevel")}
                min="0"
                max="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.spicyLevel && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.spicyLevel.message}
                </p>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Menu <span className="text-red-500">*</span>
            </label>
            <ImageUploader
              images={images}
              onChange={(urls) => setValue("images", urls)}
              maxImages={5}
              folder="menus"
              disabled={isSubmitting}
            />
            {errors.images && (
              <p className="mt-1 text-sm text-red-500">
                {errors.images.message}
              </p>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("isAvailable")}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Tersedia untuk dijual
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("isPopular")}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Tandai sebagai menu populer
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
