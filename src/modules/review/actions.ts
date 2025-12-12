"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ReviewFormData } from "./schema";

export async function getMenuReviews(menuId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { menuId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function getReviewStats(menuId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { menuId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution = reviews.reduce(
      (dist, r) => {
        dist[r.rating as 1 | 2 | 3 | 4 | 5]++;
        return dist;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    );

    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      ratingDistribution,
    };
  } catch (error) {
    console.error("Error fetching review stats:", error);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
}

export async function canUserReview(
  userId: string,
  menuId: string,
  orderId?: string
) {
  try {
    // Check if user has ordered this menu
    const orderWithMenu = await prisma.order.findFirst({
      where: {
        customerId: userId,
        status: "COMPLETED",
        items: {
          some: {
            menuId,
          },
        },
        ...(orderId ? { id: orderId } : {}),
      },
    });

    if (!orderWithMenu) {
      return { canReview: false, reason: "Belum pernah memesan menu ini" };
    }

    // Check if already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        menuId,
        ...(orderId ? { orderId } : {}),
      },
    });

    if (existingReview) {
      return { canReview: false, reason: "Sudah memberikan review" };
    }

    return { canReview: true, orderId: orderWithMenu.id };
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return { canReview: false, reason: "Terjadi kesalahan" };
  }
}

export async function createReview(
  userId: string,
  menuId: string,
  data: ReviewFormData,
  orderId?: string
) {
  try {
    // Verify eligibility
    const eligibility = await canUserReview(userId, menuId, orderId);
    if (!eligibility.canReview) {
      return { success: false, error: eligibility.reason };
    }

    const review = await prisma.review.create({
      data: {
        userId,
        menuId,
        orderId: eligibility.orderId,
        rating: data.rating,
        comment: data.comment || null,
        images: data.images,
        isVerified: true, // Verified because we checked order
      },
    });

    revalidatePath(`/menu/${menuId}`);
    revalidatePath("/reservation");
    return { success: true, review };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Gagal membuat review" };
  }
}

export async function updateReview(
  reviewId: string,
  userId: string,
  data: ReviewFormData
) {
  try {
    // Verify ownership
    const existing = await prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!existing) {
      return { success: false, error: "Review tidak ditemukan" };
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        comment: data.comment || null,
        images: data.images,
      },
    });

    revalidatePath(`/menu/${existing.menuId}`);
    revalidatePath("/reservation");
    return { success: true, review };
  } catch (error) {
    console.error("Error updating review:", error);
    return { success: false, error: "Gagal memperbarui review" };
  }
}

export async function deleteReview(reviewId: string, userId: string) {
  try {
    const existing = await prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!existing) {
      return { success: false, error: "Review tidak ditemukan" };
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidatePath(`/menu/${existing.menuId}`);
    revalidatePath("/reservation");
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Gagal menghapus review" };
  }
}

export async function addAdminReply(reviewId: string, adminReply: string) {
  try {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { adminReply },
    });

    revalidatePath(`/menu/${review.menuId}`);
    return { success: true, review };
  } catch (error) {
    console.error("Error adding admin reply:", error);
    return { success: false, error: "Gagal menambahkan balasan" };
  }
}
