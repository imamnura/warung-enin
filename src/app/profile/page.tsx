import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/modules/auth/actions";
import { ProfileForm } from "@/modules/auth/components/ProfileForm";
import { ChangePasswordForm } from "@/modules/auth/components/ChangePasswordForm";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profile");
  }

  const user = await getUserProfile(session.user.id);

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Profil Saya</h1>
              <Link href="/reservation">
                <Button variant="outline">Kembali ke Menu</Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.phone}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member sejak{" "}
                  {new Date(user.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-primary/5 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {user._count.orders}
                </p>
                <p className="text-sm text-gray-600">Total Pesanan</p>
              </div>
              <Link
                href="/profile/orders"
                className="bg-blue-50 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors"
              >
                <p className="text-3xl font-bold text-blue-600">📦</p>
                <p className="text-sm text-gray-600">Riwayat Pesanan</p>
              </Link>
              <Link
                href="/profile/addresses"
                className="bg-green-50 rounded-lg p-4 text-center hover:bg-green-100 transition-colors"
              >
                <p className="text-3xl font-bold text-green-600">📍</p>
                <p className="text-sm text-gray-600">Alamat Tersimpan</p>
              </Link>
              <Link
                href="/profile/favorites"
                className="bg-red-50 rounded-lg p-4 text-center hover:bg-red-100 transition-colors"
              >
                <p className="text-3xl font-bold text-red-600">❤️</p>
                <p className="text-sm text-gray-600">Menu Favorit</p>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Edit Profil</h2>
              <ProfileForm user={user} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Ubah Password</h2>
              <ChangePasswordForm userId={user.id} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
