import { prisma } from "@/lib/prisma";

export async function getSettings() {
  let settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    // Create default settings if not exists
    settings = await prisma.settings.create({
      data: { id: "default" },
    });
  }

  return settings;
}
