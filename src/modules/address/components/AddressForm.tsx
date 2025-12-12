"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addressFormSchema, type AddressFormData } from "../schema";
import { createAddress, updateAddress } from "../actions";
import { Button } from "@/shared/ui/Button";

type AddressFormProps = {
  userId: string;
  address?: {
    id: string;
    label: string;
    recipientName: string;
    recipientPhone: string;
    address: string;
    district: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    notes: string | null;
    isDefault: boolean;
  };
  onSuccess?: () => void;
};

export function AddressForm({ userId, address, onSuccess }: AddressFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: address
      ? {
          label: address.label,
          recipientName: address.recipientName,
          recipientPhone: address.recipientPhone,
          address: address.address,
          district: address.district || "",
          city: address.city || "",
          province: address.province || "",
          postalCode: address.postalCode || "",
          notes: address.notes || "",
          isDefault: address.isDefault,
        }
      : {
          label: "",
          recipientName: "",
          recipientPhone: "",
          address: "",
          district: "",
          city: "",
          province: "",
          postalCode: "",
          notes: "",
          isDefault: false,
        },
  });

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);

    try {
      const result = address
        ? await updateAddress(address.id, userId, data)
        : await createAddress(userId, data);

      if (result.success) {
        toast.success(
          address ? "Alamat berhasil diperbarui" : "Alamat berhasil ditambahkan"
        );
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(result.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan alamat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label Alamat <span className="text-red-500">*</span>
        </label>
        <input
          {...register("label")}
          type="text"
          placeholder="Rumah, Kantor, Apartemen, dll"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.label && (
          <p className="text-sm text-red-500 mt-1">{errors.label.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Penerima <span className="text-red-500">*</span>
          </label>
          <input
            {...register("recipientName")}
            type="text"
            placeholder="Nama lengkap penerima"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.recipientName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.recipientName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            No. Telepon <span className="text-red-500">*</span>
          </label>
          <input
            {...register("recipientPhone")}
            type="tel"
            placeholder="08xxxxxxxxxx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.recipientPhone && (
            <p className="text-sm text-red-500 mt-1">
              {errors.recipientPhone.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat Lengkap <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("address")}
          rows={3}
          placeholder="Jalan, Gang, No. Rumah, RT/RW"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kecamatan
          </label>
          <input
            {...register("district")}
            type="text"
            placeholder="Kecamatan"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kota/Kabupaten
          </label>
          <input
            {...register("city")}
            type="text"
            placeholder="Kota/Kabupaten"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provinsi
          </label>
          <input
            {...register("province")}
            type="text"
            placeholder="Provinsi"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kode Pos
          </label>
          <input
            {...register("postalCode")}
            type="text"
            placeholder="12345"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catatan (Patokan)
        </label>
        <textarea
          {...register("notes")}
          rows={2}
          placeholder="Patokan lokasi, warna pagar, ciri khas rumah, dll"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          {...register("isDefault")}
          type="checkbox"
          id="isDefault"
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-700">
          Jadikan alamat utama
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting
            ? "Menyimpan..."
            : address
            ? "Perbarui"
            : "Tambah Alamat"}
        </Button>
      </div>
    </form>
  );
}
