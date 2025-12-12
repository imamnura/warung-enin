import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";

// Load environment variables
config();

const prisma = new PrismaClient();

async function seedHeroSlides() {
  console.log("🎬 Seeding hero slides...");

  // Delete existing slides
  await prisma.heroSlide.deleteMany({});

  const slides = [
    {
      title: "Warung Enin",
      subtitle: "📍 Taraju, Tasikmalaya",
      description:
        "Nikmati kelezatan nasi, lauk pauk, bakso, soto, dan ayam penyet terbaik dengan layanan digital modern",
      imageUrl: "/banner1.jpg",
      buttonText: "Pesan Sekarang",
      buttonLink: "/reservation",
      order: 0,
      isActive: true,
    },
    {
      title: "Menu Istimewa Hari Ini",
      subtitle: "🍜 Spesial Bakso & Soto",
      description:
        "Coba menu favorit pelanggan kami dengan kuah yang gurih dan daging yang lembut",
      imageUrl: "/banner2.jpg",
      buttonText: "Lihat Menu",
      buttonLink: "/menu",
      order: 1,
      isActive: true,
    },
    {
      title: "Ayam Penyet Pedas",
      subtitle: "🔥 Level Pedas Pilihan Anda",
      description:
        "Sambal terasi khas yang menggugah selera dengan ayam yang renyah di luar, juicy di dalam",
      imageUrl: "/banner3.jpg",
      buttonText: "Pesan Sekarang",
      buttonLink: "/reservation",
      order: 2,
      isActive: true,
    },
  ];

  for (const slide of slides) {
    await prisma.heroSlide.create({
      data: slide,
    });
  }

  console.log(`✅ Created ${slides.length} hero slides`);
}

async function main() {
  try {
    await seedHeroSlides();
    console.log("\n✨ Hero slides seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Error seeding hero slides:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
