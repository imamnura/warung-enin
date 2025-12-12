import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllHeroSlides } from "@/modules/hero/actions";
import { HeroSlideList } from "@/modules/hero/components/HeroSlideList";

export const metadata: Metadata = {
  title: "Hero Slides | Dashboard",
  description: "Kelola hero slides di halaman utama",
};

export default async function HeroSlidesPage() {
  const session = await auth();

  // Only admins can access this page
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const slides = await getAllHeroSlides();

  return (
    <div className="p-6">
      <HeroSlideList initialSlides={slides} />
    </div>
  );
}
