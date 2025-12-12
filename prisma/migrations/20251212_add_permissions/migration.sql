-- CreateEnum for permission actions
CREATE TYPE "PermissionAction" AS ENUM (
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'MANAGE'
);

-- CreateEnum for permission resources
CREATE TYPE "PermissionResource" AS ENUM (
  'MENU',
  'ORDER',
  'CUSTOMER',
  'COURIER',
  'PAYMENT',
  'ANALYTICS',
  'SETTINGS',
  'PROMO',
  'REVIEW',
  'NOTIFICATION',
  'PRIVILEGE'
);

-- CreateTable Permission
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "resource" "PermissionResource" NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "permissions_role_idx" ON "permissions"("role");
CREATE INDEX "permissions_resource_idx" ON "permissions"("resource");
CREATE UNIQUE INDEX "permissions_role_resource_action_key" ON "permissions"("role", "resource", "action");

-- Insert default permissions for ADMIN (Full access)
INSERT INTO "permissions" ("id", "role", "resource", "action", "allowed") VALUES
  (gen_random_uuid(), 'ADMIN', 'MENU', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'ORDER', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'CUSTOMER', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'COURIER', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'PAYMENT', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'ANALYTICS', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'SETTINGS', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'PROMO', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'REVIEW', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'NOTIFICATION', 'MANAGE', true),
  (gen_random_uuid(), 'ADMIN', 'PRIVILEGE', 'MANAGE', true);

-- Insert default permissions for CUSTOMER
INSERT INTO "permissions" ("id", "role", "resource", "action", "allowed", "conditions") VALUES
  (gen_random_uuid(), 'CUSTOMER', 'MENU', 'READ', true, NULL),
  (gen_random_uuid(), 'CUSTOMER', 'ORDER', 'CREATE', true, NULL),
  (gen_random_uuid(), 'CUSTOMER', 'ORDER', 'READ', true, '{"ownOnly": true}'::jsonb),
  (gen_random_uuid(), 'CUSTOMER', 'ORDER', 'UPDATE', true, '{"ownOnly": true, "statuses": ["ORDERED", "PAYMENT_PENDING"]}'::jsonb),
  (gen_random_uuid(), 'CUSTOMER', 'PAYMENT', 'CREATE', true, '{"ownOnly": true}'::jsonb),
  (gen_random_uuid(), 'CUSTOMER', 'PAYMENT', 'READ', true, '{"ownOnly": true}'::jsonb),
  (gen_random_uuid(), 'CUSTOMER', 'REVIEW', 'CREATE', true, '{"ownOnly": true}'::jsonb),
  (gen_random_uuid(), 'CUSTOMER', 'REVIEW', 'READ', true, NULL),
  (gen_random_uuid(), 'CUSTOMER', 'REVIEW', 'UPDATE', true, '{"ownOnly": true}'::jsonb),
  (gen_random_uuid(), 'CUSTOMER', 'REVIEW', 'DELETE', true, '{"ownOnly": true}'::jsonb);

-- Insert default permissions for COURIER
INSERT INTO "permissions" ("id", "role", "resource", "action", "allowed", "conditions") VALUES
  (gen_random_uuid(), 'COURIER', 'ORDER', 'READ', true, '{"assignedOnly": true}'::jsonb),
  (gen_random_uuid(), 'COURIER', 'ORDER', 'UPDATE', true, '{"assignedOnly": true, "statuses": ["ON_DELIVERY"]}'::jsonb),
  (gen_random_uuid(), 'COURIER', 'PAYMENT', 'READ', true, '{"assignedOrderOnly": true}'::jsonb),
  (gen_random_uuid(), 'COURIER', 'PAYMENT', 'UPDATE', true, '{"assignedOrderOnly": true, "methods": ["CASH"]}'::jsonb),
  (gen_random_uuid(), 'COURIER', 'CUSTOMER', 'READ', true, '{"assignedOrderOnly": true, "limitedFields": true}'::jsonb);
