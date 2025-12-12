"use client";

import { supabase } from "@/lib/supabase";

// Hero slide image requirements
export const HERO_IMAGE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_WIDTH: 1200,
  MIN_HEIGHT: 400,
  RECOMMENDED_ASPECT_RATIO: 3, // 3:1 ratio (width:height)
  ACCEPTED_FORMATS: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
};

interface ImageValidationResult {
  valid: boolean;
  error?: string;
  width?: number;
  height?: number;
}

/**
 * Validate image file before upload
 */
export async function validateHeroImage(
  file: File
): Promise<ImageValidationResult> {
  // Check file size
  if (file.size > HERO_IMAGE_CONSTRAINTS.MAX_SIZE) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${
        HERO_IMAGE_CONSTRAINTS.MAX_SIZE / 1024 / 1024
      }MB`,
    };
  }

  // Check file type
  if (!HERO_IMAGE_CONSTRAINTS.ACCEPTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP",
    };
  }

  // Check image dimensions
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const width = img.width;
      const height = img.height;

      // Check minimum dimensions
      if (
        width < HERO_IMAGE_CONSTRAINTS.MIN_WIDTH ||
        height < HERO_IMAGE_CONSTRAINTS.MIN_HEIGHT
      ) {
        resolve({
          valid: false,
          error: `Dimensi gambar terlalu kecil. Minimal ${HERO_IMAGE_CONSTRAINTS.MIN_WIDTH}x${HERO_IMAGE_CONSTRAINTS.MIN_HEIGHT}px`,
          width,
          height,
        });
        return;
      }

      // Check aspect ratio (give 20% tolerance)
      const aspectRatio = width / height;
      const targetRatio = HERO_IMAGE_CONSTRAINTS.RECOMMENDED_ASPECT_RATIO;
      const tolerance = 0.2;

      if (
        aspectRatio < targetRatio * (1 - tolerance) ||
        aspectRatio > targetRatio * (1 + tolerance)
      ) {
        resolve({
          valid: false,
          error: `Rasio aspek tidak sesuai. Disarankan ${targetRatio}:1 (landscape). Dimensi Anda: ${width}x${height} (${aspectRatio.toFixed(
            2
          )}:1)`,
          width,
          height,
        });
        return;
      }

      resolve({
        valid: true,
        width,
        height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: "Gagal memuat gambar. File mungkin rusak",
      });
    };

    img.src = url;
  });
}

/**
 * Upload hero image to Supabase Storage
 */
export async function uploadHeroImage(file: File): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Validate image first
    const validation = await validateHeroImage(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = file.name.split(".").pop();
    const filename = `hero-${timestamp}-${randomStr}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("hero-slides")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return {
        success: false,
        error: "Gagal upload ke Supabase: " + error.message,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("hero-slides").getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat upload gambar",
    };
  }
}

/**
 * Delete hero image from Supabase Storage
 */
export async function deleteHeroImage(imageUrl: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Extract filename from URL
    const urlParts = imageUrl.split("/");
    const filename = urlParts[urlParts.length - 1];

    // Only delete if it's a Supabase URL
    if (!imageUrl.includes("supabase.co") && !imageUrl.includes("hero-")) {
      return { success: true }; // Skip deletion for external URLs
    }

    const { error } = await supabase.storage
      .from("hero-slides")
      .remove([filename]);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menghapus gambar",
    };
  }
}
