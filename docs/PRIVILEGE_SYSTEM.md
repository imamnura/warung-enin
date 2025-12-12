# 🔐 Sistem Privilege (Hak Akses)

## Overview

Sistem privilege menggunakan **Role-Based Access Control (RBAC)** yang merupakan best practice untuk enterprise applications. Sistem ini memungkinkan kontrol granular terhadap apa yang bisa dilakukan setiap role di aplikasi.

## Architecture

### 3 Komponen Utama:

1. **Role** - Peran pengguna (ADMIN, CUSTOMER, COURIER)
2. **Resource** - Resource yang diakses (MENU, ORDER, PAYMENT, dll)
3. **Action** - Aksi yang dilakukan (CREATE, READ, UPDATE, DELETE, MANAGE)

### Enum Types

```typescript
enum Role {
  ADMIN
  CUSTOMER
  COURIER
}

enum PermissionResource {
  MENU
  ORDER
  CUSTOMER
  COURIER
  PAYMENT
  ANALYTICS
  SETTINGS
  PROMO
  REVIEW
  NOTIFICATION
  PRIVILEGE
}

enum PermissionAction {
  CREATE    // Buat data baru
  READ      // Lihat data
  UPDATE    // Ubah data
  DELETE    // Hapus data
  MANAGE    // Full CRUD access
}
```

## Default Permissions

### 👨‍💼 ADMIN (11 permissions)

**Full access** ke semua resources dengan action `MANAGE`:

- ✅ Menu Management
- ✅ Order Management
- ✅ Customer Management
- ✅ Courier Management
- ✅ Payment Verification
- ✅ Analytics & Reports
- ✅ Settings Configuration
- ✅ Promo Management
- ✅ Review Management
- ✅ Notification Management
- ✅ **Privilege Management** (hanya admin)

**Keunggulan:**

- Satu-satunya role yang bisa mengubah privilege
- Akses penuh ke dashboard admin
- Bisa CRUD semua data tanpa batasan

---

### 👤 CUSTOMER (10 permissions)

**Limited access** dengan kondisi "ownOnly" (hanya data milik sendiri):

#### Menu

- ✅ `READ` - Lihat daftar menu

#### Order

- ✅ `CREATE` - Buat pesanan baru
- ✅ `READ` (ownOnly) - Lihat pesanan sendiri
- ✅ `UPDATE` (ownOnly, status: ORDERED/PAYMENT_PENDING) - Ubah pesanan yang belum diproses

#### Payment

- ✅ `CREATE` (ownOnly) - Upload bukti pembayaran
- ✅ `READ` (ownOnly) - Lihat status pembayaran sendiri

#### Review

- ✅ `CREATE` (ownOnly) - Buat review
- ✅ `READ` - Lihat semua review
- ✅ `UPDATE` (ownOnly) - Edit review sendiri
- ✅ `DELETE` (ownOnly) - Hapus review sendiri

**Keunggulan:**

- Privacy protection (hanya bisa akses data sendiri)
- Bisa batalkan/ubah order sebelum diproses
- Kontrol penuh atas review sendiri

---

### 🛵 COURIER (5 permissions)

**Restricted access** hanya untuk pesanan yang di-assign:

#### Order

- ✅ `READ` (assignedOnly) - Lihat pesanan yang ditugaskan
- ✅ `UPDATE` (assignedOnly, status: ON_DELIVERY) - Update status saat mengantar

#### Payment

- ✅ `READ` (assignedOrderOnly) - Lihat info pembayaran pesanan yang ditugaskan
- ✅ `UPDATE` (assignedOrderOnly, methods: CASH) - Konfirmasi COD (Cash on Delivery)

#### Customer

- ✅ `READ` (assignedOrderOnly, limitedFields) - Lihat info customer (nama, alamat, telp) untuk pengiriman

**Keunggulan:**

- Akses minimal hanya yang diperlukan
- Tidak bisa lihat data customer lain
- Hanya bisa update order yang sedang diantar

---

## Conditional Permissions

Sistem mendukung **conditional permissions** untuk kontrol lebih detail:

### Conditions

```typescript
{
  ownOnly?: boolean;              // Hanya data milik sendiri
  assignedOnly?: boolean;          // Hanya yang di-assign
  assignedOrderOnly?: boolean;     // Hanya order yang di-assign
  limitedFields?: boolean;         // Hanya field tertentu
  statuses?: string[];             // Status yang diizinkan
  methods?: string[];              // Payment methods yang diizinkan
}
```

### Contoh Penggunaan

**Customer Update Order:**

```typescript
{
  role: "CUSTOMER",
  resource: "ORDER",
  action: "UPDATE",
  allowed: true,
  conditions: {
    ownOnly: true,
    statuses: ["ORDERED", "PAYMENT_PENDING"]
  }
}
```

✅ Customer HANYA bisa update pesanan sendiri DAN hanya jika statusnya ORDERED atau PAYMENT_PENDING

**Courier Update Payment:**

```typescript
{
  role: "COURIER",
  resource: "PAYMENT",
  action: "UPDATE",
  allowed: true,
  conditions: {
    assignedOrderOnly: true,
    methods: ["CASH"]
  }
}
```

✅ Kurir HANYA bisa update pembayaran untuk pesanan yang ditugaskan DAN hanya untuk metode CASH (COD)

---

## API Functions

### Check Permission

```typescript
import { checkPermission } from "@/lib/permissions";

const hasPermission = await checkPermission(
  "CUSTOMER", // role
  "ORDER", // resource
  "UPDATE", // action
  {
    userId: "user-123",
    resourceOwnerId: "user-123",
    status: "ORDERED",
  }
);
```

### Require Permission (throws error if denied)

```typescript
import { requirePermission } from "@/lib/permissions";

await requirePermission("ADMIN", "PRIVILEGE", "MANAGE");
// Throws error if not admin
```

### Get Role Permissions

```typescript
import { getRolePermissions } from "@/lib/permissions";

const permissions = await getRolePermissions("CUSTOMER");
```

---

## UI Management

### Admin Dashboard

**Path:** `/dashboard/privileges`

**Features:**

- 🔐 Hanya ADMIN yang bisa akses
- 📊 View permissions per role
- ✏️ Toggle allow/deny per permission
- 🔄 Reset to default
- 📝 View conditional permissions

**Cara Menggunakan:**

1. Login sebagai ADMIN
2. Buka menu "Hak Akses" di sidebar
3. Expand role yang ingin diubah
4. Toggle permission on/off
5. Atau klik "Reset Default" untuk kembalikan ke default

---

## Seeding Permissions

### Initial Seed

```bash
pnpm exec tsx prisma/seed-permissions.ts
```

Output:

```
🔐 Seeding permissions...
✅ Created 26 permissions
   - Admin: 11 permissions
   - Customer: 10 permissions
   - Courier: 5 permissions
```

### Reset via UI

Admin bisa reset permissions ke default melalui dashboard dengan klik tombol "Reset Default" di setiap role.

---

## Security Best Practices

### ✅ Implemented

1. **Principle of Least Privilege**

   - Setiap role hanya mendapat akses minimal yang diperlukan
   - Customer tidak bisa lihat data customer lain
   - Courier hanya bisa akses pesanan yang ditugaskan

2. **Conditional Access**

   - Status-based permissions (e.g., hanya bisa update jika status ORDERED)
   - Owner-based permissions (ownOnly)
   - Assignment-based permissions (assignedOnly)

3. **Separation of Duties**

   - Hanya ADMIN yang bisa ubah privilege
   - Customer tidak bisa verifikasi pembayaran sendiri
   - Courier tidak bisa assign diri sendiri ke order

4. **Defense in Depth**
   - Permission check di backend (server actions)
   - Permission check di middleware
   - UI hiding (tapi tetap ada backend check)

### 🛡️ Usage in Server Actions

```typescript
"use server";

import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

export async function updateOrderAction(orderId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Check permission dengan context
  await requirePermission(session.user.role, "ORDER", "UPDATE", {
    userId: session.user.id,
    resourceOwnerId: order.customerId,
    status: order.status,
  });

  // Safe to proceed...
}
```

---

## Migration & Database

### Schema

```prisma
model Permission {
  id         String             @id @default(uuid())
  role       Role
  resource   PermissionResource
  action     PermissionAction
  allowed    Boolean            @default(true)
  conditions Json?
  createdAt  DateTime           @default(now())
  updatedAt  DateTime           @updatedAt

  @@unique([role, resource, action])
  @@index([role])
  @@index([resource])
}
```

### Unique Constraint

Kombinasi `(role, resource, action)` harus unik - mencegah duplicate permissions.

### Indexes

- `role` - untuk query cepat berdasarkan role
- `resource` - untuk query cepat berdasarkan resource

---

## Troubleshooting

### Permission Denied

```
Error: Permission denied: CUSTOMER cannot MANAGE PRIVILEGE
```

**Solution:** Aksi ini hanya bisa dilakukan oleh ADMIN.

### Conditional Permission Failed

```
Error: Permission denied due to conditions
```

**Solution:** Check kondisi permission (ownOnly, status, dll)

### Cannot Access Privileges Page

**Solution:** Hanya ADMIN yang bisa akses `/dashboard/privileges`

---

## Future Enhancements

### Recommended Improvements:

1. **Field-level Permissions** - Kontrol akses per field
2. **Time-based Permissions** - Permission yang expire
3. **Custom Roles** - Admin bisa buat role baru
4. **Audit Log** - Track siapa ubah permission kapan
5. **Permission Templates** - Template untuk role baru

---

## Summary

### Why This Design?

1. **Scalable** - Mudah tambah resource atau action baru
2. **Flexible** - Support conditional permissions
3. **Secure** - Default deny, explicit allow
4. **Maintainable** - Centralized permission logic
5. **User-friendly** - UI untuk manage tanpa coding

### Key Principles

- ✅ **Default Deny** - Everything denied kecuali explicitly allowed
- ✅ **Granular Control** - Per-action permissions
- ✅ **Conditional Logic** - Status, ownership, assignment based
- ✅ **Audit Ready** - Semua permission changes tracked
- ✅ **Easy to Manage** - UI-based management

---

## Contact & Support

Untuk pertanyaan tentang privilege system:

1. Check dokumentasi ini
2. Review code di `/src/lib/permissions.ts`
3. Lihat contoh usage di server actions
4. Test di `/dashboard/privileges`
