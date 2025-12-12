"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";

export async function createPromo(formData: FormData) {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as
    | "PERCENTAGE"
    | "FIXED_AMOUNT"
    | "FREE_DELIVERY";
  const value = parseFloat(formData.get("value") as string);
  const minPurchase = parseFloat(formData.get("minPurchase") as string) || 0;
  const maxDiscount = formData.get("maxDiscount")
    ? parseFloat(formData.get("maxDiscount") as string)
    : null;
  const usageLimit = formData.get("usageLimit")
    ? parseInt(formData.get("usageLimit") as string)
    : null;
  const perUserLimit = parseInt(formData.get("perUserLimit") as string) || 1;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);

  try {
    await prisma.promo.create({
      data: {
        code: code.toUpperCase(),
        name,
        description,
        type,
        value: new Decimal(value),
        minPurchase: new Decimal(minPurchase),
        maxDiscount: maxDiscount ? new Decimal(maxDiscount) : null,
        usageLimit,
        perUserLimit,
        startDate,
        endDate,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/promo");
    return { success: true, message: "Promo berhasil dibuat!" };
  } catch (error) {
    console.error("Error creating promo:", error);
    return { success: false, message: "Gagal membuat promo" };
  }
}

export async function updatePromo(id: string, formData: FormData) {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as
    | "PERCENTAGE"
    | "FIXED_AMOUNT"
    | "FREE_DELIVERY";
  const value = parseFloat(formData.get("value") as string);
  const minPurchase = parseFloat(formData.get("minPurchase") as string) || 0;
  const maxDiscount = formData.get("maxDiscount")
    ? parseFloat(formData.get("maxDiscount") as string)
    : null;
  const usageLimit = formData.get("usageLimit")
    ? parseInt(formData.get("usageLimit") as string)
    : null;
  const perUserLimit = parseInt(formData.get("perUserLimit") as string) || 1;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const isActive = formData.get("isActive") === "true";

  try {
    await prisma.promo.update({
      where: { id },
      data: {
        code: code.toUpperCase(),
        name,
        description,
        type,
        value: new Decimal(value),
        minPurchase: new Decimal(minPurchase),
        maxDiscount: maxDiscount ? new Decimal(maxDiscount) : null,
        usageLimit,
        perUserLimit,
        startDate,
        endDate,
        isActive,
      },
    });

    revalidatePath("/dashboard/promo");
    return { success: true, message: "Promo berhasil diupdate!" };
  } catch (error) {
    console.error("Error updating promo:", error);
    return { success: false, message: "Gagal mengupdate promo" };
  }
}

export async function deletePromo(id: string) {
  try {
    await prisma.promo.delete({
      where: { id },
    });

    revalidatePath("/dashboard/promo");
    return { success: true, message: "Promo berhasil dihapus!" };
  } catch (error) {
    console.error("Error deleting promo:", error);
    return { success: false, message: "Gagal menghapus promo" };
  }
}

export async function togglePromoStatus(id: string) {
  try {
    const promo = await prisma.promo.findUnique({
      where: { id },
    });

    if (!promo) {
      return { success: false, message: "Promo tidak ditemukan" };
    }

    await prisma.promo.update({
      where: { id },
      data: { isActive: !promo.isActive },
    });

    revalidatePath("/dashboard/promo");
    return {
      success: true,
      message: `Promo ${promo.isActive ? "dinonaktifkan" : "diaktifkan"}!`,
    };
  } catch (error) {
    console.error("Error toggling promo status:", error);
    return { success: false, message: "Gagal mengubah status promo" };
  }
}

export async function validatePromoCode(code: string, subtotal: number) {
  try {
    const promo = await prisma.promo.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      return { valid: false, message: "Kode promo tidak ditemukan" };
    }

    if (!promo.isActive) {
      return { valid: false, message: "Kode promo tidak aktif" };
    }

    const now = new Date();
    if (now < promo.startDate) {
      return { valid: false, message: "Promo belum dimulai" };
    }

    if (now > promo.endDate) {
      return { valid: false, message: "Promo sudah berakhir" };
    }

    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return { valid: false, message: "Kuota promo sudah habis" };
    }

    const minPurchase = Number(promo.minPurchase);
    if (subtotal < minPurchase) {
      return {
        valid: false,
        message: `Minimum pembelian Rp ${minPurchase.toLocaleString("id-ID")}`,
      };
    }

    let discount = 0;
    const value = Number(promo.value);

    if (promo.type === "PERCENTAGE") {
      discount = (subtotal * value) / 100;
      const maxDiscount = promo.maxDiscount
        ? Number(promo.maxDiscount)
        : Infinity;
      discount = Math.min(discount, maxDiscount);
    } else if (promo.type === "FIXED_AMOUNT") {
      discount = value;
    } else if (promo.type === "FREE_DELIVERY") {
      // This will be handled in checkout calculation
      discount = 0; // Not applied to subtotal
    }

    return {
      valid: true,
      message: "Kode promo valid!",
      promo: {
        id: promo.id,
        code: promo.code,
        name: promo.name,
        type: promo.type,
        discount: Math.floor(discount),
      },
    };
  } catch (error) {
    console.error("Error validating promo:", error);
    return { valid: false, message: "Gagal memvalidasi kode promo" };
  }
}

export async function incrementPromoUsage(code: string) {
  try {
    await prisma.promo.update({
      where: { code: code.toUpperCase() },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Error incrementing promo usage:", error);
  }
}
