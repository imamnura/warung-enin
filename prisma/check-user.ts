import "../prisma.config";
import { prisma } from "../src/lib/prisma";

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@warungenin.com" },
  });

  console.log("=== User Check ===");
  console.log("User found:", !!user);

  if (user) {
    console.log("Email:", user.email);
    console.log("Name:", user.name);
    console.log("Role:", user.role);
    console.log("Has password:", !!user.password);
    console.log(
      "Password hash starts with $2b$:",
      user.password?.startsWith("$2b$")
    );
  } else {
    console.log("User not found!");
  }

  await prisma.$disconnect();
}

checkUser().catch(console.error);
