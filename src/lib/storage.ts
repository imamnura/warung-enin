import { supabase } from "./supabase";

const BUCKET_NAME = "menu-images";

export type UploadResult = {
  url: string;
  path: string;
};

/**
 * Upload a single file to Supabase Storage
 * @param file - File to upload
 * @param folder - Optional folder path (e.g., "menus", "profiles")
 * @returns Object containing public URL and storage path
 */
export async function uploadFile(
  file: File,
  folder: string = "menus"
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path,
  };
}

/**
 * Upload multiple files to Supabase Storage
 * @param files - Array of files to upload
 * @param folder - Optional folder path
 * @returns Array of upload results
 */
export async function uploadFiles(
  files: File[],
  folder: string = "menus"
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadFile(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Supabase Storage
 * @param path - Storage path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    console.error("Delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Delete multiple files from Supabase Storage
 * @param paths - Array of storage paths to delete
 */
export async function deleteFiles(paths: string[]): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove(paths);

  if (error) {
    console.error("Delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Extract storage path from Supabase public URL
 * @param url - Public URL from Supabase
 * @returns Storage path or null if invalid URL
 */
export function getPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/object/public/${BUCKET_NAME}/`);
    return pathParts[1] || null;
  } catch {
    return null;
  }
}
