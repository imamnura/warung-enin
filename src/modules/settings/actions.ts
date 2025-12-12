"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  let settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    // Create default settings if not exists
    settings = await prisma.settings.create({
      data: { id: "default" },
    });
  }

  return settings;
}

export async function updateSettings(formData: FormData) {
  const storeName = formData.get("storeName") as string;
  const storeAddress = formData.get("storeAddress") as string;
  const storePhone = formData.get("storePhone") as string;
  const storeEmail = formData.get("storeEmail") as string;
  const storeLogo = formData.get("storeLogo") as string;
  const deliveryRadius = parseFloat(formData.get("deliveryRadius") as string);
  const deliveryFee = parseFloat(formData.get("deliveryFee") as string);
  const minOrder = parseFloat(formData.get("minOrder") as string);
  const taxPercentage = parseFloat(formData.get("taxPercentage") as string);
  const serviceCharge = parseFloat(formData.get("serviceCharge") as string);
  const whatsappNumber = formData.get("whatsappNumber") as string;
  const whatsappEnabled = formData.get("whatsappEnabled") === "true";
  const isOpen = formData.get("isOpen") === "true";
  const openingHour = formData.get("openingHour") as string;
  const closingHour = formData.get("closingHour") as string;
  const gmapsUrl = formData.get("gmapsUrl") as string;
  const instagramUrl = formData.get("instagramUrl") as string;
  const facebookUrl = formData.get("facebookUrl") as string;

  try {
    await prisma.settings.upsert({
      where: { id: "default" },
      update: {
        storeName,
        storeAddress,
        storePhone,
        storeEmail: storeEmail || null,
        storeLogo: storeLogo || null,
        deliveryRadius,
        deliveryFee,
        minOrder,
        taxPercentage,
        serviceCharge,
        whatsappNumber: whatsappNumber || null,
        whatsappEnabled,
        isOpen,
        openingHour,
        closingHour,
        gmapsUrl: gmapsUrl || null,
        instagramUrl: instagramUrl || null,
        facebookUrl: facebookUrl || null,
      },
      create: {
        id: "default",
        storeName,
        storeAddress,
        storePhone,
        storeEmail: storeEmail || null,
        storeLogo: storeLogo || null,
        deliveryRadius,
        deliveryFee,
        minOrder,
        taxPercentage,
        serviceCharge,
        whatsappNumber: whatsappNumber || null,
        whatsappEnabled,
        isOpen,
        openingHour,
        closingHour,
        gmapsUrl: gmapsUrl || null,
        instagramUrl: instagramUrl || null,
        facebookUrl: facebookUrl || null,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Pengaturan berhasil disimpan!" };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, message: "Gagal menyimpan pengaturan" };
  }
}

export async function toggleStoreStatus() {
  try {
    const settings = await getSettings();

    await prisma.settings.update({
      where: { id: "default" },
      data: { isOpen: !settings.isOpen },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: `Toko ${settings.isOpen ? "ditutup" : "dibuka"}!`,
    };
  } catch (error) {
    console.error("Error toggling store status:", error);
    return { success: false, message: "Gagal mengubah status toko" };
  }
}
