import { prisma } from "@/lib/prisma";

type Role = "ADMIN" | "CUSTOMER" | "COURIER";
type PermissionResource =
  | "MENU"
  | "ORDER"
  | "CUSTOMER"
  | "COURIER"
  | "PAYMENT"
  | "ANALYTICS"
  | "SETTINGS"
  | "PROMO"
  | "REVIEW"
  | "NOTIFICATION"
  | "PRIVILEGE";

type PermissionAction = "CREATE" | "READ" | "UPDATE" | "DELETE" | "MANAGE";

interface PermissionConditions {
  ownOnly?: boolean;
  assignedOnly?: boolean;
  assignedOrderOnly?: boolean;
  limitedFields?: boolean;
  statuses?: string[];
  methods?: string[];
}

/**
 * Check if a user has permission to perform an action on a resource
 * @param role - User's role (ADMIN, CUSTOMER, COURIER)
 * @param resource - Resource being accessed
 * @param action - Action being performed
 * @param context - Additional context for conditional permissions
 */
export async function checkPermission(
  role: Role,
  resource: PermissionResource,
  action: PermissionAction,
  context?: {
    userId?: string;
    resourceOwnerId?: string;
    courierId?: string;
    assignedCourierId?: string;
    status?: string;
    method?: string;
  }
): Promise<boolean> {
  try {
    // Check for MANAGE permission first (full access)
    const managePermission = await prisma.permission.findUnique({
      where: {
        role_resource_action: {
          role,
          resource,
          action: "MANAGE",
        },
      },
    });

    if (managePermission?.allowed) {
      return true;
    }

    // Check for specific action permission
    const permission = await prisma.permission.findUnique({
      where: {
        role_resource_action: {
          role,
          resource,
          action,
        },
      },
    });

    if (!permission || !permission.allowed) {
      return false;
    }

    // Check conditional permissions
    if (permission.conditions && context) {
      const conditions = permission.conditions as PermissionConditions;

      // Check if user can only access their own resources
      if (conditions.ownOnly && context.userId !== context.resourceOwnerId) {
        return false;
      }

      // Check if courier can only access assigned orders
      if (
        conditions.assignedOnly &&
        context.courierId !== context.assignedCourierId
      ) {
        return false;
      }

      if (
        conditions.assignedOrderOnly &&
        context.courierId !== context.assignedCourierId
      ) {
        return false;
      }

      // Check if action is allowed for specific statuses
      if (
        conditions.statuses &&
        context.status &&
        !conditions.statuses.includes(context.status)
      ) {
        return false;
      }

      // Check if action is allowed for specific payment methods
      if (
        conditions.methods &&
        context.method &&
        !conditions.methods.includes(context.method)
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
}

/**
 * Get all permissions for a role
 */
export async function getRolePermissions(role: Role) {
  return prisma.permission.findMany({
    where: { role },
    orderBy: [{ resource: "asc" }, { action: "asc" }],
  });
}

/**
 * Get all permissions grouped by role
 */
export async function getAllPermissions() {
  const permissions = await prisma.permission.findMany({
    orderBy: [{ role: "asc" }, { resource: "asc" }, { action: "asc" }],
  });

  return {
    ADMIN: permissions.filter((p) => p.role === "ADMIN"),
    CUSTOMER: permissions.filter((p) => p.role === "CUSTOMER"),
    COURIER: permissions.filter((p) => p.role === "COURIER"),
  };
}

/**
 * Require permission middleware
 * Throws error if permission is denied
 */
export async function requirePermission(
  role: Role,
  resource: PermissionResource,
  action: PermissionAction,
  context?: Parameters<typeof checkPermission>[3]
): Promise<void> {
  const hasPermission = await checkPermission(role, resource, action, context);

  if (!hasPermission) {
    throw new Error(`Permission denied: ${role} cannot ${action} ${resource}`);
  }
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(
  role: Role,
  checks: Array<{ resource: PermissionResource; action: PermissionAction }>
): Promise<boolean> {
  for (const check of checks) {
    const hasPermission = await checkPermission(
      role,
      check.resource,
      check.action
    );
    if (hasPermission) {
      return true;
    }
  }
  return false;
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(
  role: Role,
  checks: Array<{ resource: PermissionResource; action: PermissionAction }>
): Promise<boolean> {
  for (const check of checks) {
    const hasPermission = await checkPermission(
      role,
      check.resource,
      check.action
    );
    if (!hasPermission) {
      return false;
    }
  }
  return true;
}
