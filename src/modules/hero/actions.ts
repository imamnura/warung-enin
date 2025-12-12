"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client for deleting files
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Helper: Delete image from Supabase storage
 */
async function deleteImageFromStorage(imageUrl: string) {
  try {
    // Only delete if it's a Supabase URL
    if (!imageUrl.includes("supabase.co")) {
      return; // Skip deletion for external URLs or local files
    }

    const urlParts = imageUrl.split("/");
    const filename = urlParts[urlParts.length - 1];

    await supabaseAdmin.storage.from("hero-slides").remove([filename]);
  } catch (error) {
    console.error("Error deleting image from storage:", error);
    // Don't throw - allow the operation to continue
  }
}

/**
 * Get all active hero slides ordered by order field
 */
export async function getActiveHeroSlides() {
  return prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

/**
 * Get all hero slides (for admin)
 */
export async function getAllHeroSlides() {
  return prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });
}

/**
 * Create a new hero slide
 */
export async function createHeroSlide(data: {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
  isActive?: boolean;
}) {
  try {
    const slide = await prisma.heroSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        imageUrl: data.imageUrl,
        buttonText: data.buttonText || "Pesan Sekarang",
        buttonLink: data.buttonLink || "/reservation",
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/hero-slides");

    return { success: true, data: slide };
  } catch (error) {
    console.error("Error creating hero slide:", error);
    return { error: "Failed to create hero slide" };
  }
}

/**
 * Update a hero slide
 */
export async function updateHeroSlide(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
    order?: number;
    isActive?: boolean;
  }
) {
  try {
    // If imageUrl is being changed, delete the old image
    if (data.imageUrl) {
      const currentSlide = await prisma.heroSlide.findUnique({
        where: { id },
        select: { imageUrl: true },
      });

      if (currentSlide && currentSlide.imageUrl !== data.imageUrl) {
        await deleteImageFromStorage(currentSlide.imageUrl);
      }
    }

    const slide = await prisma.heroSlide.update({
      where: { id },
      data,
    });

    revalidatePath("/");
    revalidatePath("/dashboard/hero-slides");

    return { success: true, data: slide };
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return { error: "Failed to update hero slide" };
  }
}

/**
 * Delete a hero slide
 */
export async function deleteHeroSlide(id: string) {
  try {
    // Get the slide first to delete its image
    const slide = await prisma.heroSlide.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (slide) {
      await deleteImageFromStorage(slide.imageUrl);
    }

    await prisma.heroSlide.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/hero-slides");

    return { success: true };
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return { error: "Failed to delete hero slide" };
  }
}

/**
 * Toggle hero slide active status
 */
export async function toggleHeroSlideStatus(id: string, isActive: boolean) {
  try {
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/hero-slides");

    return { success: true, data: slide };
  } catch (error) {
    console.error("Error toggling hero slide status:", error);
    return { error: "Failed to toggle hero slide status" };
  }
}

/**
 * Reorder hero slides
 */
export async function reorderHeroSlides(
  slides: { id: string; order: number }[]
) {
  try {
    await Promise.all(
      slides.map((slide) =>
        prisma.heroSlide.update({
          where: { id: slide.id },
          data: { order: slide.order },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/dashboard/hero-slides");

    return { success: true };
  } catch (error) {
    console.error("Error reordering hero slides:", error);
    return { error: "Failed to reorder hero slides" };
  }
}
