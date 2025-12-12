import { getMenus } from "@/modules/menu/queries";
import { getActivePromos } from "@/modules/promo/queries";
import { getActiveHeroSlides } from "@/modules/hero/actions";
import { HeroSection } from "@/modules/home/components/HeroSection";
import { FeaturedMenu } from "@/modules/home/components/FeaturedMenu";
import { FeaturesSection } from "@/modules/home/components/FeaturesSection";
import { ActivePromosSection } from "@/modules/home/components/ActivePromosSection";
import { GallerySection } from "@/modules/home/components/GallerySection";
import { TestimonialsSection } from "@/modules/home/components/TestimonialsSection";
import { OperatingHours } from "@/modules/home/components/OperatingHours";
import { CTASection } from "@/modules/home/components/CTASection";

export default async function Home() {
  const [allMenus, activePromos, heroSlides] = await Promise.all([
    getMenus(),
    getActivePromos(),
    getActiveHeroSlides(),
  ]);

  // Select featured menus (first 4 available menus)
  // Transform Decimal price to number for client component
  const featuredMenus = allMenus.slice(0, 4).map((menu) => ({
    id: menu.id,
    name: menu.name,
    category: menu.category,
    price: Number(menu.price),
    images: menu.images,
    isPopular: menu.isPopular || false,
    isAvailable: menu.isAvailable,
  }));

  // Transform promos for client component - Convert Decimal to number
  const promos = activePromos.map((promo) => ({
    id: promo.id,
    code: promo.code,
    name: promo.name,
    description: promo.description,
    type: promo.type,
    value: Number(promo.value),
    minPurchase: Number(promo.minPurchase),
  }));

  return (
    <div className="min-h-screen">
      <HeroSection slides={heroSlides} />
      <FeaturedMenu menus={featuredMenus} />
      <FeaturesSection />
      <ActivePromosSection promos={promos} />
      <GallerySection />
      <TestimonialsSection />
      <OperatingHours />
      <CTASection />
    </div>
  );
}
