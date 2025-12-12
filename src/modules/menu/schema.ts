import { z } from "zod";
import { MenuCategory } from "@/generated/prisma/enums";

export const menuFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama menu harus diisi")
    .max(100, "Nama terlalu panjang"),
  description: z
    .string()
    .min(1, "Deskripsi harus diisi")
    .max(500, "Deskripsi terlalu panjang"),
  price: z
    .string()
    .min(1, "Harga harus diisi")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Harga harus berupa angka positif",
    }),
  category: z.nativeEnum(MenuCategory, {
    message: "Kategori harus dipilih",
  }),
  images: z
    .array(z.string().url("URL gambar tidak valid"))
    .min(1, "Minimal 1 gambar")
    .max(5, "Maksimal 5 gambar"),
  isAvailable: z.boolean(),
  stock: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Stok harus berupa angka positif atau 0",
    })
    .optional()
    .nullable(),
  prepTime: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Waktu persiapan harus berupa angka positif",
    })
    .optional()
    .nullable(),
  spicyLevel: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 5,
      {
        message: "Level pedas harus antara 0-5",
      }
    )
    .optional()
    .nullable(),
  isPopular: z.boolean(),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;
