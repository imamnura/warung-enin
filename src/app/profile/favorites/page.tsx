import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserFavorites } from "@/modules/favorite/actions";
import { FavoriteCard } from "@/modules/favorite/components/FavoriteCard";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profile/favorites");
  }

  const favorites = await getUserFavorites(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Menu Favorit</h1>
              <p className="text-gray-600 mt-1">Koleksi menu favorit Anda</p>
            </div>
            <div className="flex gap-3">
              <Link href="/reservation">
                <Button>Lihat Menu</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">Kembali</Button>
              </Link>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🤍</div>
              <h2 className="text-xl font-semibold mb-2">Belum Ada Favorit</h2>
              <p className="text-gray-600 mb-6">
                Tambahkan menu favorit Anda untuk akses cepat!
              </p>
              <Link href="/reservation">
                <Button>Jelajahi Menu</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                {favorites.length} menu favorit
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <FavoriteCard
                    key={favorite.id}
                    userId={session.user.id}
                    favorite={favorite}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
