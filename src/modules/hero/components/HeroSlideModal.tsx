"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/shared/ui/Button";
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { createHeroSlide, updateHeroSlide } from "@/modules/hero/actions";
import {
  uploadHeroImage,
  HERO_IMAGE_CONSTRAINTS,
} from "@/lib/upload-hero-image";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonLink: string | null;
  order: number;
  isActive: boolean;
}

interface HeroSlideModalProps {
  slide: HeroSlide | null;
  isOpen: boolean;
  onClose: (updatedSlide?: HeroSlide) => void;
}

export function HeroSlideModal({
  slide,
  isOpen,
  onClose,
}: HeroSlideModalProps) {
  const [formData, setFormData] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    description: slide?.description || "",
    imageUrl: slide?.imageUrl || "",
    buttonText: slide?.buttonText || "Pesan Sekarang",
    buttonLink: slide?.buttonLink || "/reservation",
    isActive: slide?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "upload">("url");
  const [previewUrl, setPreviewUrl] = useState<string>(slide?.imageUrl || "");

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadHeroImage(file);

      if (result.success && result.url) {
        setFormData({ ...formData, imageUrl: result.url });
        setPreviewUrl(result.url);
        toast.success("Gambar berhasil diupload");
      } else {
        toast.error(result.error || "Gagal upload gambar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = slide
        ? await updateHeroSlide(slide.id, formData)
        : await createHeroSlide(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          slide ? "Hero slide berhasil diupdate" : "Hero slide berhasil dibuat"
        );
        onClose(result.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {slide ? "Edit Hero Slide" : "Tambah Hero Slide"}
          </h2>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Warung Enin"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 📍 Taraju, Tasikmalaya"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Deskripsi singkat tentang warung..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Hero <span className="text-red-500">*</span>
            </label>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setInputMode("url")}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${inputMode === "url"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300 hover:border-gray-400"
                  }`}
              >
                <LinkIcon className="w-4 h-4" />
                Link URL
              </button>
              <button
                type="button"
                onClick={() => setInputMode("upload")}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${inputMode === "upload"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300 hover:border-gray-400"
                  }`}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>

            {/* URL Input */}
            {inputMode === "url" && (
              <div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan URL gambar dari internet
                </p>
              </div>
            )}

            {/* File Upload */}
            {inputMode === "upload" && (
              <div>
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    {isUploading ? (
                      <div className="text-primary">
                        <Upload className="w-8 h-8 mx-auto mb-2 animate-bounce" />
                        <p className="text-sm font-medium">Mengupload...</p>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700">
                          Klik untuk pilih gambar
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG, atau WebP (Max{" "}
                          {HERO_IMAGE_CONSTRAINTS.MAX_SIZE / 1024 / 1024}MB)
                        </p>
                        <p className="text-xs text-gray-500">
                          Min: {HERO_IMAGE_CONSTRAINTS.MIN_WIDTH}x
                          {HERO_IMAGE_CONSTRAINTS.MIN_HEIGHT}px | Rasio: 3:1
                          (landscape)
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}

            {/* Preview */}
            {previewUrl && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Preview:
                </p>
                <div className="relative aspect-[3/1] rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    onError={() => {
                      toast.error("Gagal memuat preview gambar");
                      setPreviewUrl("");
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Button Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teks Tombol
            </label>
            <input
              type="text"
              value={formData.buttonText}
              onChange={(e) =>
                setFormData({ ...formData, buttonText: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Pesan Sekarang"
            />
          </div>

          {/* Button Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Tombol
            </label>
            <input
              type="text"
              value={formData.buttonLink}
              onChange={(e) =>
                setFormData({ ...formData, buttonLink: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="/reservation"
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Aktifkan slide ini
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              disabled={isSubmitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isUploading}
              className="flex-1"
            >
              {isSubmitting
                ? "Menyimpan..."
                : isUploading
                  ? "Mengupload..."
                  : slide
                    ? "Update"
                    : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
