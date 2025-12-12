"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { AddressFormData } from "./schema";

export async function getUserAddresses(userId: string) {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return addresses;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
}

export async function createAddress(userId: string, data: AddressFormData) {
  try {
    // If this is set as default, unset other defaults first
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });

    revalidatePath("/profile/addresses");
    return { success: true, address };
  } catch (error) {
    console.error("Error creating address:", error);
    return { success: false, error: "Gagal menyimpan alamat" };
  }
}

export async function updateAddress(
  addressId: string,
  userId: string,
  data: AddressFormData
) {
  try {
    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      return { success: false, error: "Alamat tidak ditemukan" };
    }

    // If this is set as default, unset other defaults first
    if (data.isDefault && !existing.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data,
    });

    revalidatePath("/profile/addresses");
    return { success: true, address };
  } catch (error) {
    console.error("Error updating address:", error);
    return { success: false, error: "Gagal memperbarui alamat" };
  }
}

export async function deleteAddress(addressId: string, userId: string) {
  try {
    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      return { success: false, error: "Alamat tidak ditemukan" };
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    revalidatePath("/profile/addresses");
    return { success: true };
  } catch (error) {
    console.error("Error deleting address:", error);
    return { success: false, error: "Gagal menghapus alamat" };
  }
}

export async function setDefaultAddress(addressId: string, userId: string) {
  try {
    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      return { success: false, error: "Alamat tidak ditemukan" };
    }

    // Unset all defaults
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default
    await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    revalidatePath("/profile/addresses");
    return { success: true };
  } catch (error) {
    console.error("Error setting default address:", error);
    return { success: false, error: "Gagal mengatur alamat default" };
  }
}
