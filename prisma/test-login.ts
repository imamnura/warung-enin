import "../prisma.config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function testLogin() {
  const email = "admin@warungenin.com";
  const password = "admin123";

  console.log("=== Testing Login ===");
  console.log("Email:", email);
  console.log("Password:", password);
  console.log();

  // Step 1: Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  console.log("Step 1: User lookup");
  console.log("User found:", !!user);

  if (!user) {
    console.log("❌ User not found");
    await prisma.$disconnect();
    return;
  }
  console.log("✅ User found");
  console.log();

  // Step 2: Check password exists
  console.log("Step 2: Password check");
  console.log("Has password field:", !!user.password);

  if (!user.password) {
    console.log("❌ No password in database");
    await prisma.$disconnect();
    return;
  }
  console.log("✅ Password exists");
  console.log();

  // Step 3: Compare passwords
  console.log("Step 3: Password comparison");
  console.log("Input password:", password);
  console.log("Hash from DB:", user.password.substring(0, 20) + "...");

  const isValid = await bcrypt.compare(password, user.password);

  console.log("bcrypt.compare result:", isValid);

  if (isValid) {
    console.log("✅ PASSWORD MATCH - Login should work!");
  } else {
    console.log("❌ PASSWORD MISMATCH - Login will fail!");
  }

  await prisma.$disconnect();
}

testLogin().catch(console.error);
