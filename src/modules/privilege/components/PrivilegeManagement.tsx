"use client";

import { useState } from "react";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import {
  Shield,
  Check,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import {
  updatePermissionAction,
  resetRolePermissionsAction,
} from "@/modules/privilege/actions";
import { toast } from "sonner";

interface Permission {
  id: string;
  role: string;
  resource: string;
  action: string;
  allowed: boolean;
  conditions: any;
}

interface PrivilegeManagementProps {
  initialPermissions: {
    ADMIN: Permission[];
    CUSTOMER: Permission[];
    COURIER: Permission[];
  };
}

const RESOURCE_LABELS: Record<string, string> = {
  MENU: "Menu",
  ORDER: "Pesanan",
  CUSTOMER: "Pelanggan",
  COURIER: "Kurir",
  PAYMENT: "Pembayaran",
  ANALYTICS: "Analitik",
  SETTINGS: "Pengaturan",
  PROMO: "Promo",
  REVIEW: "Review",
  NOTIFICATION: "Notifikasi",
  PRIVILEGE: "Hak Akses",
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Buat",
  READ: "Lihat",
  UPDATE: "Ubah",
  DELETE: "Hapus",
  MANAGE: "Kelola Semua",
};

export function PrivilegeManagement({
  initialPermissions,
}: PrivilegeManagementProps) {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [expandedRole, setExpandedRole] = useState<string | null>("ADMIN");
  const [isResetting, setIsResetting] = useState(false);

  const handleTogglePermission = async (
    permissionId: string,
    currentAllowed: boolean
  ) => {
    try {
      const result = await updatePermissionAction({
        id: permissionId,
        allowed: !currentAllowed,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Update local state
      setPermissions((prev) => {
        const newPermissions = { ...prev };
        for (const role of Object.keys(newPermissions) as Array<
          keyof typeof newPermissions
        >) {
          newPermissions[role] = newPermissions[role].map((p) =>
            p.id === permissionId ? { ...p, allowed: !currentAllowed } : p
          );
        }
        return newPermissions;
      });

      toast.success("Hak akses berhasil diubah");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengubah hak akses");
    }
  };

  const handleResetRole = async (role: "ADMIN" | "CUSTOMER" | "COURIER") => {
    if (
      !confirm(
        `Reset semua hak akses untuk ${role}? Ini akan mengembalikan ke pengaturan default.`
      )
    ) {
      return;
    }

    setIsResetting(true);
    try {
      const result = await resetRolePermissionsAction(role);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      window.location.reload(); // Reload to get fresh data
    } catch (error) {
      console.error(error);
      toast.error("Gagal mereset hak akses");
    } finally {
      setIsResetting(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "CUSTOMER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COURIER":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrator";
      case "CUSTOMER":
        return "Member/Pelanggan";
      case "COURIER":
        return "Kurir";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-xl text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Manajemen Hak Akses</h2>
        </div>
        <p className="text-white/90">
          Kelola hak akses untuk setiap role (Admin, Member, Kurir)
        </p>
      </div>

      {/* Roles */}
      <div className="space-y-4">
        {(Object.keys(permissions) as Array<keyof typeof permissions>).map(
          (role) => {
            const rolePermissions = permissions[role];
            const isExpanded = expandedRole === role;
            const allowedCount = rolePermissions.filter(
              (p) => p.allowed
            ).length;
            const totalCount = rolePermissions.length;

            return (
              <div
                key={role}
                className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden"
              >
                {/* Role Header */}
                <div
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${getRoleColor(
                    role
                  )} border-b-2`}
                  onClick={() => setExpandedRole(isExpanded ? null : role)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">
                          {getRoleLabel(role)}
                        </h3>
                        <p className="text-sm opacity-80">
                          {allowedCount} dari {totalCount} izin aktif
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetRole(
                          role as "ADMIN" | "CUSTOMER" | "COURIER"
                        );
                      }}
                      disabled={isResetting}
                      className="bg-white"
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${isResetting ? "animate-spin" : ""
                          }`}
                      />
                      Reset Default
                    </Button>
                  </div>
                </div>

                {/* Permissions List */}
                {isExpanded && (
                  <div className="p-6">
                    <div className="grid gap-6">
                      {Object.entries(
                        rolePermissions.reduce((acc, perm) => {
                          if (!acc[perm.resource]) {
                            acc[perm.resource] = [];
                          }
                          acc[perm.resource].push(perm);
                          return acc;
                        }, {} as Record<string, Permission[]>)
                      ).map(([resource, perms]) => (
                        <div
                          key={resource}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            {RESOURCE_LABELS[resource] || resource}
                          </h4>

                          <div className="grid gap-2">
                            {perms.map((perm) => (
                              <div
                                key={perm.id}
                                className="flex items-center justify-between bg-white p-3 rounded-lg border"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {ACTION_LABELS[perm.action] ||
                                        perm.action}
                                    </span>
                                    {perm.action === "MANAGE" && (
                                      <Badge color="primary">Full Access</Badge>
                                    )}
                                  </div>

                                  {perm.conditions && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      Kondisi:{" "}
                                      {JSON.stringify(perm.conditions, null, 2)
                                        .replace(/[{}"]/g, "")
                                        .replace(/,/g, ", ")}
                                    </p>
                                  )}
                                </div>

                                <Button
                                  size="sm"
                                  variant={perm.allowed ? "primary" : "outline"}
                                  onClick={() =>
                                    handleTogglePermission(
                                      perm.id,
                                      perm.allowed
                                    )
                                  }
                                  className={
                                    perm.allowed
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                  }
                                >
                                  {perm.allowed ? (
                                    <>
                                      <Check className="w-4 h-4 mr-1" />
                                      Diizinkan
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-4 h-4 mr-1" />
                                      Ditolak
                                    </>
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
