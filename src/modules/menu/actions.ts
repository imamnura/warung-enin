"use server";

import { prisma } from "@/lib/prisma";
import { menuFormSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";

export async function createMenu(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      images: JSON.parse(formData.get("images") as string),
      isAvailable: formData.get("isAvailable") === "true",
      stock: formData.get("stock") as string | null,
      prepTime: formData.get("prepTime") as string | null,
      spicyLevel: formData.get("spicyLevel") as string | null,
      isPopular: formData.get("isPopular") === "true",
    };

    const validated = menuFormSchema.parse(data);

    await prisma.menu.create({
      data: {
        name: validated.name,
        description: validated.description,
        price: new Decimal(validated.price),
        category: validated.category,
        images: validated.images,
        isAvailable: validated.isAvailable,
        stock: validated.stock ? parseInt(validated.stock) : undefined,
        prepTime: validated.prepTime ? parseInt(validated.prepTime) : undefined,
        spicyLevel: validated.spicyLevel
          ? parseInt(validated.spicyLevel)
          : undefined,
        isPopular: validated.isPopular,
      },
    });

    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch (error) {
    console.error("Error creating menu:", error);
    return { success: false, error: "Failed to create menu" };
  }
}

export async function updateMenu(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      images: JSON.parse(formData.get("images") as string),
      isAvailable: formData.get("isAvailable") === "true",
      stock: formData.get("stock") as string | null,
      prepTime: formData.get("prepTime") as string | null,
      spicyLevel: formData.get("spicyLevel") as string | null,
      isPopular: formData.get("isPopular") === "true",
    };

    const validated = menuFormSchema.parse(data);

    await prisma.menu.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description,
        price: new Decimal(validated.price),
        category: validated.category,
        images: validated.images,
        isAvailable: validated.isAvailable,
        stock: validated.stock ? parseInt(validated.stock) : undefined,
        prepTime: validated.prepTime ? parseInt(validated.prepTime) : undefined,
        spicyLevel: validated.spicyLevel
          ? parseInt(validated.spicyLevel)
          : undefined,
        isPopular: validated.isPopular,
      },
    });

    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch (error) {
    console.error("Error updating menu:", error);
    return { success: false, error: "Failed to update menu" };
  }
}
