# Testing Guide - Payment Flow

## 🎯 Test Scenarios Overview

4 scenarios utama yang harus ditest:

1. **Delivery + Transfer + Member** (Free ongkir)
2. **Delivery + Cash + Non-Member** (Ongkir Rp 2,000)
3. **Pickup + Transfer + Member** (Free ongkir)
4. **Pickup + Cash + Non-Member**

---

## 📋 Pre-Test Setup

### 1. Start Development Server

```bash
npm run dev
```

Server akan jalan di `http://localhost:3000`

### 2. Database Reset (Optional)

```bash
# Reset database untuk clean testing
npx prisma migrate reset

# Atau soft reset - hapus semua data
npx prisma studio
# Delete manual via Prisma Studio
```

### 3. Create Test Data

**Jalankan Seeding Script (RECOMMENDED):**

```bash
# Reset database & run seed
npx prisma migrate reset --force

# Atau hanya seed tanpa reset
npx prisma db seed
```

✅ **Seed akan otomatis create:**

- **Admin Test** → `admin@warung.com` / `admin123`
- **Courier Test** → `kurir@warung.com` / `kurir123`
- **Member Test** → `member@test.com` / `password123`
- Plus data lainnya (menu, promos, dll)

**Manual Setup (Optional) - Jika tidak pakai seed:**

#### A. Create Member User (via Register)

#### A. Create Member User (via Register)

```
Route: /auth/register
Data:
- Name: Test Member
- Phone: 081999888777
- Email: member@test.com
- Password: password123
- Confirm: password123

✅ Expected: User created dengan memberSince = now()
```

**Note:** Jika sudah run seed, user ini sudah ada. Skip step ini.

**Note:** Jika sudah run seed, user ini sudah ada. Skip step ini.

#### B. Admin & Courier (Automatic via Seed)

Jika sudah run `npx prisma db seed`, users berikut otomatis ter-create:

**Admin:**

- Email: `admin@warung.com`
- Password: `admin123`
- Role: ADMIN
- ID: `admin-test-id`

**Courier:**

- Email: `kurir@warung.com`
- Password: `kurir123`
- Role: COURIER
- ID: `courier-test-id`

**Login:**

```
Route: /auth/login

Admin:
- Email: admin@warung.com
- Password: admin123

Courier:
- Email: kurir@warung.com
- Password: kurir123
```

---

## 🧪 Test Scenario 1: Delivery + Transfer + Member

### Objective

Test member benefits (free ongkir) dengan payment transfer dan delivery

### Steps

#### 1. Login sebagai Member

```
Route: /auth/login
Email: member@test.com
Password: password123

✅ Expected: Login berhasil
```

#### 2. Browse Menu & Add to Cart

```
Route: /
- Klik menu item
- Add to cart (qty 2)
- View cart

✅ Expected: Cart shows items
```

#### 3. Create Order - Delivery + Transfer

```
Route: /reservation
Form:
- Name: Test Member
- Phone: 081999888777
- Delivery Method: DIANTAR
- Address: Jl. Test No. 123
- Payment Method: TRANSFER

Submit Order

✅ Expected Results:
- Order created dengan status: ORDERED
- isMember: true
- deliveryFee: 0 (FREE untuk member)
- Payment created dengan status: PENDING
- Dapat order number (misal: WE-20251206-0001)
```

#### 4. Track Order & Upload Payment Proof

```
Route: /track
Input:
- Order Number: WE-20251206-0001
- Phone: 081999888777

Klik "Cari Pesanan"

✅ Expected: Order details muncul

Upload Bukti Transfer:
- Klik "Upload Bukti Pembayaran"
- Select image (< 5MB, jpg/png/webp)
- Klik "Upload"

✅ Expected Results:
- Upload success message
- Order status: PAYMENT_PENDING
- Payment status: PENDING
- Bukti image tersimpan di /public/uploads/payment-proofs/
- Image preview muncul
```

#### 5. Admin Verify Payment

```
Route: /dashboard/payment-verification

**LOGIN DULU SEBAGAI ADMIN:**
Email: admin@warung.com
Password: admin123

Setelah login, akses /dashboard/payment-verification

✅ Expected: List showing 1 pending payment

Klik "Verifikasi" pada payment

✅ Expected: Modal terbuka dengan:
- Payment proof image
- Order details
- Customer info
- Items list
- Total: Rp XX,XXX
- Ongkir: Rp 0 (Member)

Action - APPROVE:
- Add notes (optional): "Verified OK"
- Klik "Setujui" button

✅ Expected Results:
- Payment status: VERIFIED
- Order status: PROCESSED
- verifiedAt: now()
- verifiedBy: admin-test-id
- Modal closes
- List refreshes
```

#### 6. Process Order for Delivery

```
Route: /dashboard/orders

Find order WE-20251206-0001
Current status: PROCESSED

Klik "Proses" atau change status to ON_DELIVERY

✅ Expected:
- Order status: ON_DELIVERY
- Ready untuk kurir deliver
```

#### 7. Complete Delivery

```
Route: /dashboard/orders

Find order WE-20251206-0001
Current status: ON_DELIVERY

Change status to COMPLETED

✅ Expected Results:
- Order status: COMPLETED
- completedAt: now()
- User totalOrders incremented (+1)
```

#### 8. Verify Member Stats

```
Route: /dashboard/customers

Find member "Test Member"

✅ Expected:
- totalOrders: 1
- memberSince: (registration date)
```

---

## 🧪 Test Scenario 2: Delivery + Cash + Non-Member

### Objective

Test non-member dengan ongkir Rp 2,000, payment cash (COD)

### Steps

#### 1. Create Order as Guest

```
Route: /reservation
(JANGAN login - test sebagai guest)

Form:
- Name: Guest Customer
- Phone: 083333333333
- Delivery Method: DIANTAR
- Address: Jl. Guest No. 456
- Payment Method: CASH

Submit Order

✅ Expected Results:
- Order created dengan status: ORDERED
- isMember: false (no logged in user)
- deliveryFee: 2000 (NON-MEMBER charge)
- Payment created dengan status: PENDING
- Subtotal + Ongkir Rp 2,000
- Order number: WE-20251206-0002
```

#### 2. Track Order

```
Route: /track
Input:
- Order Number: WE-20251206-0002
- Phone: 083333333333

✅ Expected:
- Order details shows
- NO upload button (karena CASH)
- Status: ORDERED
- Payment: PENDING
- Total includes ongkir Rp 2,000
```

#### 3. Admin Process Order (Skip Payment Verification)

```
Route: /dashboard/orders

Find order WE-20251206-0002

Change status: ORDERED → PROCESSED

✅ Expected:
- Order status: PROCESSED
- Payment still PENDING (cash belum dibayar)
- No need payment verification
```

#### 4. Assign to Courier & Deliver

```
Route: /dashboard/orders

Find order WE-20251206-0002

Change status: PROCESSED → ON_DELIVERY

✅ Expected:
- Order status: ON_DELIVERY
- Courier can see order
```

#### 5. Courier Receive Cash Payment

```
Route: /dashboard/orders
(atau buat dedicated courier dashboard)

When delivered, klik "Konfirmasi Pembayaran Cash"

Action: confirmCashPayment(orderId, courierId)

✅ Expected Results:
- Payment status: PAID
- Order status: COMPLETED
- completedAt: now()
- Guest user totalOrders NOT incremented (bukan member)
```

#### 6. Courier Hand Over Cash to Kasir

```
Route: /dashboard/cash-management

**LOGIN DULU SEBAGAI KURIR:**
Email: kurir@warung.com
Password: kurir123

Setelah login, akses /dashboard/cash-management

✅ Expected: List showing 1 cash pending handover
- Order: WE-20251206-0002
- Amount: Rp XX,XXX
- Status: Belum Diserahkan

Klik "Serahkan ke Kasir"

✅ Expected Results:
- Payment status: HANDED_OVER
- courierHandedAt: now()
- courierHandedBy: courier-test-id
- Removed from pending list
```

#### 7. Verify Cash Reconciliation

```
Route: /dashboard/payments

Filter: HANDED_OVER payments

✅ Expected:
- Payment WE-20251206-0002 visible
- Status: HANDED_OVER
- Courier: courier-test-id
- Handed at timestamp
```

---

## 🧪 Test Scenario 3: Pickup + Transfer + Member

### Objective

Test pickup order (AMBIL_SENDIRI) dengan transfer payment

### Steps

#### 1. Login as Member

```
Route: /auth/login
Email: member@test.com
Password: password123
```

#### 2. Create Order - Pickup + Transfer

```
Route: /reservation

Form:
- Name: Test Member
- Phone: 081999888777
- Delivery Method: AMBIL_SENDIRI (Pickup)
- Payment Method: TRANSFER

Submit Order

✅ Expected Results:
- Order created dengan status: ORDERED
- isMember: true
- deliveryFee: 0 (Pickup = FREE untuk semua)
- Payment status: PENDING
- Order number: WE-20251206-0003
```

#### 3. Upload Payment Proof

```
Route: /track
Order: WE-20251206-0003

Upload bukti transfer

✅ Expected:
- Order status: PAYMENT_PENDING
- Bukti tersimpan
```

#### 4. Admin Verify

```
Route: /dashboard/payment-verification

Approve payment

✅ Expected:
- Payment status: VERIFIED
- Order status: PROCESSED
```

#### 5. Order Ready for Pickup

```
Route: /dashboard/orders

Find order WE-20251206-0003

Change status: PROCESSED → READY

✅ Expected:
- Order status: READY
- Customer notified (if notification enabled)
```

#### 6. Customer Pickup

```
Route: /dashboard/orders

When customer datang ambil:

Change status: READY → COMPLETED

✅ Expected Results:
- Order status: COMPLETED
- completedAt: now()
- Member totalOrders incremented
```

---

## 🧪 Test Scenario 4: Pickup + Cash + Non-Member

### Objective

Test pickup order dengan cash payment (bayar di tempat)

### Steps

#### 1. Create Order as Guest

```
Route: /reservation
(Tidak login)

Form:
- Name: Guest Pickup
- Phone: 084444444444
- Delivery Method: AMBIL_SENDIRI
- Payment Method: CASH

Submit Order

✅ Expected Results:
- Order created dengan status: ORDERED
- isMember: false
- deliveryFee: 0 (Pickup always free)
- Payment status: PENDING
- Order number: WE-20251206-0004
```

#### 2. Admin Process Order

```
Route: /dashboard/orders

Find order WE-20251206-0004

Change status: ORDERED → PROCESSED → READY

✅ Expected:
- Order status: READY
- Payment still PENDING
```

#### 3. Customer Pickup & Pay Cash

```
Route: /dashboard/orders

When customer datang:

1. Confirm cash payment received
   Action: confirmCashPayment(orderId, cashier-id)

   ✅ Expected: Payment status: PAID

2. Complete order
   Change status: READY → COMPLETED

   ✅ Expected: Order status: COMPLETED
```

#### 4. Verify No Cash Handover Needed

```
Route: /dashboard/cash-management

✅ Expected:
- Order WE-20251206-0004 NOT in list
- (Cash langsung diterima kasir, bukan kurir)
- Payment already PAID, tidak perlu HANDED_OVER
```

---

## ✅ Test Checklist

### Payment Verification

- [ ] Upload bukti transfer berhasil (< 5MB)
- [ ] Upload bukti > 5MB ditolak
- [ ] Upload format invalid (pdf, txt) ditolak
- [ ] Image preview muncul setelah upload
- [ ] Admin dapat lihat list pending verifications
- [ ] Admin dapat approve payment
- [ ] Admin dapat reject payment dengan notes
- [ ] Status order berubah setelah verification

### Member Benefits

- [ ] Member dapat free ongkir (deliveryFee = 0)
- [ ] Non-member kena ongkir Rp 2,000 (DIANTAR)
- [ ] Pickup (AMBIL_SENDIRI) free untuk semua
- [ ] totalOrders increment hanya untuk member
- [ ] Guest order tidak increment totalOrders

### Cash Management

- [ ] Kurir dapat lihat list cash pending handover
- [ ] Kurir dapat serahkan cash ke kasir
- [ ] Summary total cash akurat
- [ ] Payment status berubah ke HANDED_OVER
- [ ] Timestamp courierHandedAt tercatat
- [ ] Courier ID tercatat di courierHandedBy

### Order Status Flow

- [ ] Transfer: ORDERED → PAYMENT_PENDING (after upload)
- [ ] Transfer: PAYMENT_PENDING → PROCESSED (after approve)
- [ ] Cash: ORDERED → PROCESSED (direct, no verification)
- [ ] Delivery: PROCESSED → ON_DELIVERY → COMPLETED
- [ ] Pickup: PROCESSED → READY → COMPLETED
- [ ] Cannot skip invalid status transitions
- [ ] CANCELLED status working

### Edge Cases

- [ ] Order tanpa login (guest) berhasil
- [ ] Order dengan login (member) berhasil
- [ ] Multiple orders dari same user
- [ ] Upload bukti 2x (replace image)
- [ ] Reject payment kemudian order baru
- [ ] Concurrent orders dengan different payment methods

---

## 🐛 Bug Reporting Template

Jika menemukan bug:

```markdown
### Bug Report

**Scenario**: [Scenario 1/2/3/4]
**Step**: [Step number yang error]
**Expected**: [Apa yang seharusnya terjadi]
**Actual**: [Apa yang actual terjadi]
**Screenshot**: [Optional]
**Console Error**: [Copy dari browser console]

**Reproduce Steps**:

1. ...
2. ...
3. ...
```

---

## 📊 Test Results Summary

Setelah testing, isi checklist ini:

```markdown
## Test Summary - [Date]

### Scenario 1: Delivery + Transfer + Member

- [ ] PASS / [ ] FAIL
- Issues: ...

### Scenario 2: Delivery + Cash + Non-Member

- [ ] PASS / [ ] FAIL
- Issues: ...

### Scenario 3: Pickup + Transfer + Member

- [ ] PASS / [ ] FAIL
- Issues: ...

### Scenario 4: Pickup + Cash + Non-Member

- [ ] PASS / [ ] FAIL
- Issues: ...

### Overall Status

- Total Tests: 4
- Passed: X
- Failed: X
- Bugs Found: X
```

---

## 🔧 Debugging Tips

### Check Order Status

```bash
npx prisma studio
# Buka Order table
# Check: status, isMember, deliveryFee
```

### Check Payment Status

```bash
npx prisma studio
# Buka Payment table
# Check: status, proofImage, verifiedAt, verifiedBy
```

### Check Image Upload

```bash
ls -la public/uploads/payment-proofs/
# Verify image files ada
```

### Check User totalOrders

```bash
npx prisma studio
# Buka User table
# Verify totalOrders increment setelah COMPLETED
```

### Check Console Logs

- Browser DevTools → Console (customer side)
- Terminal logs (server actions)
- Network tab (API calls)

---

## ✨ Success Criteria

Test dianggap PASS jika:

- ✅ Semua 4 scenarios berjalan tanpa error
- ✅ Member benefits (free ongkir) working
- ✅ Payment verification flow complete
- ✅ Cash handover tracking working
- ✅ Order status transitions valid
- ✅ totalOrders increment untuk member only
- ✅ No console errors
- ✅ UI responsive dan user-friendly

---

Happy Testing! 🚀
