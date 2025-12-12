import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";

// Load environment variables
config();

const prisma = new PrismaClient();

async function seedPermissions() {
  console.log("🔐 Seeding permissions...");

  // Delete existing permissions
  await prisma.permission.deleteMany({});

  // Admin permissions - Full access to everything
  const adminPermissions = [
    {
      role: "ADMIN" as const,
      resource: "MENU" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "ORDER" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "CUSTOMER" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "COURIER" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "PAYMENT" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "ANALYTICS" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "SETTINGS" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "PROMO" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "REVIEW" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "NOTIFICATION" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
    {
      role: "ADMIN" as const,
      resource: "PRIVILEGE" as const,
      action: "MANAGE" as const,
      allowed: true,
    },
  ];

  // Customer permissions - Limited to own resources
  const customerPermissions = [
    {
      role: "CUSTOMER" as const,
      resource: "MENU" as const,
      action: "READ" as const,
      allowed: true,
    },
    {
      role: "CUSTOMER" as const,
      resource: "ORDER" as const,
      action: "CREATE" as const,
      allowed: true,
    },
    {
      role: "CUSTOMER" as const,
      resource: "ORDER" as const,
      action: "READ" as const,
      allowed: true,
      conditions: { ownOnly: true },
    },
    {
      role: "CUSTOMER" as const,
      resource: "ORDER" as const,
      action: "UPDATE" as const,
      allowed: true,
      conditions: { ownOnly: true, statuses: ["ORDERED", "PAYMENT_PENDING"] },
    },
    {
      role: "CUSTOMER" as const,
      resource: "PAYMENT" as const,
      action: "CREATE" as const,
      allowed: true,
      conditions: { ownOnly: true },
    },
    {
      role: "CUSTOMER" as const,
      resource: "PAYMENT" as const,
      action: "READ" as const,
      allowed: true,
      conditions: { ownOnly: true },
    },
    {
      role: "CUSTOMER" as const,
      resource: "REVIEW" as const,
      action: "CREATE" as const,
      allowed: true,
      conditions: { ownOnly: true },
    },
    {
      role: "CUSTOMER" as const,
      resource: "REVIEW" as const,
      action: "READ" as const,
      allowed: true,
    },
    {
      role: "CUSTOMER" as const,
      resource: "REVIEW" as const,
      action: "UPDATE" as const,
      allowed: true,
      conditions: { ownOnly: true },
    },
    {
      role: "CUSTOMER" as const,
      resource: "REVIEW" as const,
      action: "DELETE" as const,
      allowed: true,
      conditions: { ownOnly: true },
    },
  ];

  // Courier permissions - Limited to assigned orders
  const courierPermissions = [
    {
      role: "COURIER" as const,
      resource: "ORDER" as const,
      action: "READ" as const,
      allowed: true,
      conditions: { assignedOnly: true },
    },
    {
      role: "COURIER" as const,
      resource: "ORDER" as const,
      action: "UPDATE" as const,
      allowed: true,
      conditions: { assignedOnly: true, statuses: ["ON_DELIVERY"] },
    },
    {
      role: "COURIER" as const,
      resource: "PAYMENT" as const,
      action: "READ" as const,
      allowed: true,
      conditions: { assignedOrderOnly: true },
    },
    {
      role: "COURIER" as const,
      resource: "PAYMENT" as const,
      action: "UPDATE" as const,
      allowed: true,
      conditions: { assignedOrderOnly: true, methods: ["CASH"] },
    },
    {
      role: "COURIER" as const,
      resource: "CUSTOMER" as const,
      action: "READ" as const,
      allowed: true,
      conditions: { assignedOrderOnly: true, limitedFields: true },
    },
  ];

  // Insert all permissions
  const allPermissions = [
    ...adminPermissions,
    ...customerPermissions,
    ...courierPermissions,
  ];

  for (const perm of allPermissions) {
    await prisma.permission.create({
      data: perm as any,
    });
  }

  console.log(`✅ Created ${allPermissions.length} permissions`);
  console.log(`   - Admin: ${adminPermissions.length} permissions`);
  console.log(`   - Customer: ${customerPermissions.length} permissions`);
  console.log(`   - Courier: ${courierPermissions.length} permissions`);
}

async function main() {
  try {
    await seedPermissions();
    console.log("\n✨ Seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Error seeding permissions:", error);
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
