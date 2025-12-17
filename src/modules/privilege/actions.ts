"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import type {
  Role,
  PermissionResource,
  PermissionAction,
} from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

interface UpdatePermissionInput {
  id: string;
  allowed: boolean;
  conditions?: Record<string, unknown>;
}

/**
 * Get all permissions grouped by role
 */
export async function getAllPermissionsAction() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    await requirePermission(session.user.role as Role, "PRIVILEGE", "READ");

    const permissions = await prisma.permission.findMany({
      orderBy: [{ role: "asc" }, { resource: "asc" }, { action: "asc" }],
    });

    return {
      success: true,
      data: {
        ADMIN: permissions.filter((p) => p.role === "ADMIN"),
        CUSTOMER: permissions.filter((p) => p.role === "CUSTOMER"),
        COURIER: permissions.filter((p) => p.role === "COURIER"),
      },
    };
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to fetch permissions",
    };
  }
}

/**
 * Update a permission
 */
export async function updatePermissionAction(input: UpdatePermissionInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    await requirePermission(session.user.role as Role, "PRIVILEGE", "UPDATE");

    const permission = await prisma.permission.update({
      where: { id: input.id },
      data: {
        allowed: input.allowed,
        conditions: input.conditions ? (input.conditions as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });

    revalidatePath("/dashboard/privileges");

    return { success: true, data: permission };
  } catch (error) {
    console.error("Error updating permission:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to update permission",
    };
  }
}

/**
 * Reset permissions to default for a role
 */
export async function resetRolePermissionsAction(
  role: "ADMIN" | "CUSTOMER" | "COURIER"
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    await requirePermission(session.user.role as Role, "PRIVILEGE", "MANAGE");

    // Delete existing permissions for the role
    await prisma.permission.deleteMany({
      where: { role },
    });

    // Re-create default permissions based on role
    const defaultPermissions = getDefaultPermissions(role);

    await prisma.permission.createMany({
      data: defaultPermissions as Prisma.PermissionCreateManyInput[],
    });

    revalidatePath("/dashboard/privileges");

    return { success: true, message: `Permissions reset for ${role}` };
  } catch (error) {
    console.error("Error resetting permissions:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to reset permissions",
    };
  }
}

function getDefaultPermissions(role: Role) {
  const base = { role };

  switch (role) {
    case "ADMIN":
      return [
        {
          ...base,
          resource: "MENU" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "ORDER" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "CUSTOMER" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "COURIER" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "PAYMENT" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "ANALYTICS" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "SETTINGS" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "PROMO" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "REVIEW" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "NOTIFICATION" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
        {
          ...base,
          resource: "PRIVILEGE" as PermissionResource,
          action: "MANAGE" as PermissionAction,
          allowed: true,
        },
      ];

    case "CUSTOMER":
      return [
        { ...base, resource: "MENU", action: "READ", allowed: true },
        { ...base, resource: "ORDER", action: "CREATE", allowed: true },
        {
          ...base,
          resource: "ORDER",
          action: "READ",
          allowed: true,
          conditions: { ownOnly: true },
        },
        {
          ...base,
          resource: "ORDER",
          action: "UPDATE",
          allowed: true,
          conditions: {
            ownOnly: true,
            statuses: ["ORDERED", "PAYMENT_PENDING"],
          },
        },
        {
          ...base,
          resource: "PAYMENT",
          action: "CREATE",
          allowed: true,
          conditions: { ownOnly: true },
        },
        {
          ...base,
          resource: "PAYMENT",
          action: "READ",
          allowed: true,
          conditions: { ownOnly: true },
        },
        {
          ...base,
          resource: "REVIEW",
          action: "CREATE",
          allowed: true,
          conditions: { ownOnly: true },
        },
        { ...base, resource: "REVIEW", action: "READ", allowed: true },
        {
          ...base,
          resource: "REVIEW",
          action: "UPDATE",
          allowed: true,
          conditions: { ownOnly: true },
        },
        {
          ...base,
          resource: "REVIEW",
          action: "DELETE",
          allowed: true,
          conditions: { ownOnly: true },
        },
      ];

    case "COURIER":
      return [
        {
          ...base,
          resource: "ORDER",
          action: "READ",
          allowed: true,
          conditions: { assignedOnly: true },
        },
        {
          ...base,
          resource: "ORDER",
          action: "UPDATE",
          allowed: true,
          conditions: { assignedOnly: true, statuses: ["ON_DELIVERY"] },
        },
        {
          ...base,
          resource: "PAYMENT",
          action: "READ",
          allowed: true,
          conditions: { assignedOrderOnly: true },
        },
        {
          ...base,
          resource: "PAYMENT",
          action: "UPDATE",
          allowed: true,
          conditions: { assignedOrderOnly: true, methods: ["CASH"] },
        },
        {
          ...base,
          resource: "CUSTOMER",
          action: "READ",
          allowed: true,
          conditions: { assignedOrderOnly: true, limitedFields: true },
        },
      ];

    default:
      return [];
  }
}
