"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        return { success: false, error: "Email sudah terdaftar" };
      }
      return { success: false, error: "Nomor telepon sudah terdaftar" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error: "Gagal mendaftar. Silakan coba lagi." };
  }
}

export async function updateProfile(
  userId: string,
  data: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  }
) {
  try {
    // Check if email/phone is already used by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [{ email: data.email }, { phone: data.phone }],
          },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        return { success: false, error: "Email sudah digunakan" };
      }
      return { success: false, error: "Nomor telepon sudah digunakan" };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Gagal update profil. Silakan coba lagi." };
  }
}

export async function changePassword(
  userId: string,
  data: {
    currentPassword: string;
    newPassword: string;
  }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user?.password) {
      return { success: false, error: "User tidak ditemukan" };
    }

    // Verify current password
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Password saat ini salah" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Gagal ubah password. Silakan coba lagi." };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
