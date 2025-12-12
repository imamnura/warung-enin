"use client";

import { AddressForm } from "./AddressForm";

type Address = {
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

type EditAddressModalProps = {
  userId: string;
  address: Address;
  isOpen: boolean;
  onClose: () => void;
};

export function EditAddressModal({
  userId,
  address,
  isOpen,
  onClose,
}: EditAddressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Edit Alamat</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6">
          <AddressForm userId={userId} address={address} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
