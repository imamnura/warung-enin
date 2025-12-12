# 🔐 Quick Guide: Privilege System

## Setup

1. **Push schema changes:**

```bash
pnpm db:push
```

2. **Seed permissions:**

```bash
pnpm db:seed:permissions
```

## Access Privilege Management

1. Login sebagai **ADMIN**
2. Klik menu **"Hak Akses"** (ikon 🔐) di dashboard sidebar
3. Expand role untuk lihat/edit permissions

## Permission Structure

### Admin

- ✅ Full MANAGE access ke semua resources
- ✅ **Hanya Admin** yang bisa ubah privilege

### Customer

- ✅ Read menu
- ✅ Create/Read/Update orders (ownOnly)
- ✅ Create/Read payments (ownOnly)
- ✅ CRUD reviews (ownOnly)

### Courier

- ✅ Read/Update assigned orders only
- ✅ Read/Update payments for assigned orders (CASH only)
- ✅ Read limited customer info for delivery

## Usage in Code

### Check Permission

```typescript
import { checkPermission } from "@/lib/permissions";

const allowed = await checkPermission(session.user.role, "ORDER", "UPDATE", {
  userId: session.user.id,
  resourceOwnerId: order.customerId,
  status: order.status,
});
```

### Require Permission

```typescript
import { requirePermission } from "@/lib/permissions";

// Throws error if denied
await requirePermission(session.user.role, "MENU", "CREATE");
```

## Available Scripts

- `pnpm db:seed:permissions` - Seed initial permissions
- Reset via UI - Klik "Reset Default" button di dashboard

## Docs

📖 Full documentation: [PRIVILEGE_SYSTEM.md](./PRIVILEGE_SYSTEM.md)
