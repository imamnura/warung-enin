import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMenuReviews, getReviewStats } from "@/modules/review/actions";
import { isFavorite } from "@/modules/favorite/actions";
import { ReviewCard } from "@/modules/review/components/ReviewCard";
import { ReviewStats } from "@/modules/review/components/ReviewStats";
import { FavoriteButton } from "@/modules/favorite/components/FavoriteButton";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { formatPrice } from "@/shared/utils/price";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MenuDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const menu = await prisma.menu.findUnique({
    where: { id },
  });

  if (!menu) {
    notFound();
  }

  const reviews = await getMenuReviews(id);
  const stats = await getReviewStats(id);

  // Check if user favorited this menu
  const userFavorited = session?.user?.id
    ? await isFavorite(session.user.id, menu.id)
    : false;

  // Convert Decimal to number
  const menuData = {
    ...menu,
    price: Number(menu.price),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-6xl mx-auto">
          <Link href="/reservation">
            <Button variant="outline" className="mb-6">
              ← Kembali ke Menu
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Menu Info */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-square">
                {menuData.images[0] ? (
                  <Image
                    src={menuData.images[0]}
                    alt={menuData.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {menuData.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4 border-t">
                  {menuData.images.slice(1, 5).map((image, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${menuData.name} ${idx + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{menuData.name}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge color="primary">{menuData.category}</Badge>
                    {menuData.isPopular && <Badge color="best">Popular</Badge>}
                    {menuData.spicyLevel > 0 && (
                      <Badge color="spicy">
                        {"🌶️".repeat(menuData.spicyLevel)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!menuData.isAvailable && (
                    <Badge color="destructive">Tidak Tersedia</Badge>
                  )}
                  <FavoriteButton
                    userId={session?.user?.id ?? null}
                    menuId={menuData.id}
                    initialIsFavorite={userFavorited}
                    variant="icon"
                  />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-4xl font-bold text-primary mb-2">
                  {formatPrice(menuData.price)}
                </p>
                {stats.totalReviews > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-lg font-semibold">
                      {stats.averageRating}
                    </span>
                    <span className="text-gray-600">
                      ({stats.totalReviews} ulasan)
                    </span>
                  </div>
                )}
              </div>

              {menuData.description && (
                <div className="mb-6">
                  <h2 className="font-semibold text-lg mb-2">Deskripsi</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {menuData.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                {menuData.prepTime && (
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span className="text-gray-700">
                      {menuData.prepTime} menit
                    </span>
                  </div>
                )}
                {menuData.stock !== null && (
                  <div className="flex items-center gap-2">
                    <span>📦</span>
                    <span className="text-gray-700">
                      Stok: {menuData.stock}
                    </span>
                  </div>
                )}
              </div>

              <Link href="/reservation">
                <Button disabled={!menuData.isAvailable} className="w-full">
                  {menuData.isAvailable ? "Pesan Sekarang" : "Tidak Tersedia"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Ulasan Pelanggan</h2>
              <ReviewStats stats={stats} />
            </div>

            {session?.user?.id && (
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-gray-700 mb-3">
                  Sudah pernah mencoba menu ini? Berikan ulasan Anda!
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  * Anda hanya dapat memberikan ulasan setelah memesan menu ini
                </p>
                <Link href={`/profile/orders`}>
                  <Button>Lihat Pesanan Saya</Button>
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">💭</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Belum Ada Ulasan
                  </h3>
                  <p className="text-gray-600">
                    Jadilah yang pertama memberikan ulasan untuk menu ini!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    currentUserId={session?.user?.id}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
