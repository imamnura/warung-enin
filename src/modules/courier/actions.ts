"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CourierFormData {
  name: string;
  phone: string;
  vehicle?: string;
  vehicleNumber?: string;
  address?: string;
  idCard?: string;
  isActive?: boolean;
}

export async function createCourier(data: CourierFormData) {
  try {
    const courier = await prisma.courier.create({
      data: {
        name: data.name,
        phone: data.phone,
        vehicle: data.vehicle || null,
        vehicleNumber: data.vehicleNumber || null,
        address: data.address || null,
        idCard: data.idCard || null,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath("/dashboard/couriers");
    return { success: true, data: courier };
  } catch (error) {
    console.error("Error creating courier:", error);
    return { success: false, error: "Gagal menambahkan kurir" };
  }
}

export async function updateCourier(id: string, data: CourierFormData) {
  try {
    const courier = await prisma.courier.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        vehicle: data.vehicle || null,
        vehicleNumber: data.vehicleNumber || null,
        address: data.address || null,
        idCard: data.idCard || null,
        isActive: data.isActive,
      },
    });

    revalidatePath("/dashboard/couriers");
    return { success: true, data: courier };
  } catch (error) {
    console.error("Error updating courier:", error);
    return { success: false, error: "Gagal mengupdate kurir" };
  }
}

export async function deleteCourier(id: string) {
  try {
    // Check if courier has active orders
    const activeOrders = await prisma.order.count({
      where: {
        courierId: id,
        status: {
          in: ["ORDERED", "PROCESSED", "ON_DELIVERY"],
        },
      },
    });

    if (activeOrders > 0) {
      return {
        success: false,
        error: "Tidak dapat menghapus kurir yang masih memiliki pesanan aktif",
      };
    }

    await prisma.courier.delete({
      where: { id },
    });

    revalidatePath("/dashboard/couriers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting courier:", error);
    return { success: false, error: "Gagal menghapus kurir" };
  }
}

export async function toggleCourierStatus(id: string) {
  try {
    const courier = await prisma.courier.findUnique({
      where: { id },
    });

    if (!courier) {
      return { success: false, error: "Kurir tidak ditemukan" };
    }

    const updated = await prisma.courier.update({
      where: { id },
      data: {
        isActive: !courier.isActive,
      },
    });

    revalidatePath("/dashboard/couriers");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling courier status:", error);
    return { success: false, error: "Gagal mengubah status kurir" };
  }
}
