"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadPaymentProof } from "@/modules/payment/actions";
import { toast } from "sonner";
import Image from "next/image";

interface UploadPaymentProofProps {
  orderId: string;
  currentProofImage?: string | null;
  paymentStatus: string;
  paymentMethod: string;
}

export function UploadPaymentProof({
  orderId,
  currentProofImage,
  paymentStatus,
  paymentMethod,
}: UploadPaymentProofProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Don't show upload for cash payments
  if (paymentMethod === "CASH") {
    return null;
  }

  // Already uploaded and verified
  if (currentProofImage && paymentStatus !== "PENDING") {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md border-2 border-green-200">
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900">Bukti Pembayaran</h3>
            <p className="text-sm text-gray-600 mt-1">
              {paymentStatus === "VERIFIED" &&
                "Bukti pembayaran sedang diverifikasi admin"}
              {paymentStatus === "PAID" && "Pembayaran sudah diverifikasi"}
              {paymentStatus === "FAILED" && "Bukti pembayaran ditolak"}
            </p>
          </div>
        </div>

        {currentProofImage && (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={currentProofImage}
              alt="Bukti Pembayaran"
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>
    );
  }

  // Show upload form
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Pilih gambar terlebih dahulu");
      return;
    }

    setIsUploading(true);
    try {
      await uploadPaymentProof(orderId, selectedImage);
      setUploadSuccess(true);
      toast.success(
        "Bukti pembayaran berhasil diupload! Menunggu verifikasi admin."
      );

      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal upload bukti pembayaran"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  if (uploadSuccess) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-green-700">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Upload Berhasil!</h3>
            <p className="text-sm mt-1">Menunggu verifikasi admin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border-2 border-yellow-200">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-900">
            Upload Bukti Pembayaran
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Upload bukti transfer untuk memverifikasi pembayaran
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Image Preview or Upload Button */}
        {selectedImage ? (
          <div className="relative">
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Preview Bukti Pembayaran"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Klik untuk upload</span> atau
                drag & drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </label>
        )}

        {/* Upload Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 text-sm mb-2">
            Petunjuk Upload Bukti Transfer:
          </h4>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Upload bukti transfer yang jelas dan mudah dibaca</li>
            <li>Pastikan nominal transfer sesuai dengan total pembayaran</li>
            <li>Admin akan memverifikasi dalam 1-24 jam</li>
            <li>Pesanan akan diproses setelah pembayaran terverifikasi</li>
          </ul>
        </div>

        {/* Upload Button */}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleUpload}
          disabled={!selectedImage || isUploading}
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Bukti Pembayaran
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
