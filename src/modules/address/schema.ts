import { z } from "zod";

export const addressFormSchema = z.object({
  label: z.string().min(1, "Label wajib diisi"),
  recipientName: z.string().min(1, "Nama penerima wajib diisi"),
  recipientPhone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^[0-9+]+$/, "Nomor telepon tidak valid"),
  address: z.string().min(10, "Alamat lengkap wajib diisi"),
  district: z.string(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string(),
  notes: z.string(),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressFormSchema>;
