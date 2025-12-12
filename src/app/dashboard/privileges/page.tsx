import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllPermissionsAction } from "@/modules/privilege/actions";
import { PrivilegeManagement } from "@/modules/privilege/components/PrivilegeManagement";

export const metadata: Metadata = {
  title: "Hak Akses | Dashboard",
  description: "Kelola hak akses untuk Admin, Member, dan Kurir",
};

export default async function PrivilegePage() {
  const session = await auth();

  // Only admins can access this page
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const result = await getAllPermissionsAction();

  if (result.error || !result.data) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{result.error || "Failed to load permissions"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PrivilegeManagement initialPermissions={result.data} />
    </div>
  );
}
