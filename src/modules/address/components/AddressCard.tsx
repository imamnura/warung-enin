"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { deleteAddress, setDefaultAddress } from "../actions";

type AddressCardProps = {
  userId: string;
  address: {
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
  onEdit: () => void;
};

export function AddressCard({ userId, address, onEdit }: AddressCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAddress(address.id, userId);
      if (result.success) {
        toast.success("Alamat berhasil dihapus");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menghapus alamat");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSetDefault = async () => {
    if (address.isDefault) return;

    setIsSettingDefault(true);
    try {
      const result = await setDefaultAddress(address.id, userId);
      if (result.success) {
        toast.success("Alamat utama berhasil diubah");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal mengubah alamat utama");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSettingDefault(false);
    }
  };

  const fullAddress = [
    address.address,
    address.district,
    address.city,
    address.province,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{address.label}</h3>
            {address.isDefault && <Badge color="success">Utama</Badge>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Hapus
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium text-gray-900">{address.recipientName}</p>
          <p>{address.recipientPhone}</p>
          <p className="text-gray-700">{fullAddress}</p>
          {address.notes && (
            <p className="text-gray-500 italic">Catatan: {address.notes}</p>
          )}
        </div>

        {!address.isDefault && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleSetDefault}
              disabled={isSettingDefault}
              className="w-full"
            >
              {isSettingDefault ? "Memproses..." : "Jadikan Alamat Utama"}
            </Button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Hapus Alamat"
        message={`Apakah Anda yakin ingin menghapus alamat "${address.label}"?`}
        confirmText="Hapus"
        isLoading={isDeleting}
      />
    </>
  );
}
