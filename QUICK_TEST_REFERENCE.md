# 🚀 Quick Test Reference

## Server & Database

```bash
# Development server
npm run dev
# → Running at http://localhost:3001

# Database Studio (view data)
npx prisma studio
# → http://localhost:5555
```

---

## 🔑 Test Login Credentials

| Role        | Email            | Password    | Usage                                  |
| ----------- | ---------------- | ----------- | -------------------------------------- |
| **Member**  | member@test.com  | password123 | Customer dengan benefits (free ongkir) |
| **Admin**   | admin@warung.com | admin123    | Verify payments, manage orders         |
| **Courier** | kurir@warung.com | kurir123    | Cash management, deliveries            |

---

## 🧪 Quick Test Scenarios

### 1️⃣ Test Transfer Payment (Member)

```
1. Login: member@test.com / password123
2. Create order: /reservation
   - Method: DIANTAR
   - Payment: TRANSFER
   ✅ deliveryFee = Rp 0 (member)

3. Track: /track
   - Upload bukti pembayaran
   ✅ Status → PAYMENT_PENDING

4. Login as Admin: admin@warung.com / admin123
5. Verify: /dashboard/payment-verification
   - Approve payment
   ✅ Status → PROCESSED
```

### 2️⃣ Test Cash Payment (Guest)

```
1. NO LOGIN (guest)
2. Create order: /reservation
   - Method: DIANTAR
   - Payment: CASH
   ✅ deliveryFee = Rp 2,000 (non-member)

3. Admin process order → ON_DELIVERY
4. Courier confirm cash → COMPLETED
5. Login as Courier: kurir@warung.com / kurir123
6. Hand over cash: /dashboard/cash-management
   ✅ Payment → HANDED_OVER
```

### 3️⃣ Test Pickup + Transfer

```
1. Login: member@test.com / password123
2. Order: AMBIL_SENDIRI + TRANSFER
   ✅ deliveryFee = Rp 0
3. Upload proof → Admin verify
4. Status: PROCESSED → READY → COMPLETED
```

### 4️⃣ Test Pickup + Cash

```
1. Guest order: AMBIL_SENDIRI + CASH
   ✅ deliveryFee = Rp 0 (pickup free untuk semua)
2. Status: PROCESSED → READY
3. Customer pickup & pay → COMPLETED
```

---

## 📍 Important Routes

| Page                             | URL                                 | Access       |
| -------------------------------- | ----------------------------------- | ------------ |
| Home                             | http://localhost:3001               | Public       |
| Login                            | /auth/login                         | Public       |
| Register                         | /auth/register                      | Public       |
| Reservation                      | /reservation                        | Public       |
| Track Order                      | /track                              | Public       |
| **Admin - Payment Verification** | **/dashboard/payment-verification** | Admin only   |
| **Courier - Cash Management**    | **/dashboard/cash-management**      | Courier only |
| Dashboard Orders                 | /dashboard/orders                   | Admin        |
| Dashboard Payments               | /dashboard/payments                 | Admin        |

---

## ✅ Quick Checks

### Member Benefits

- [x] Member (dengan password) → Free ongkir
- [x] Non-member (guest) → Ongkir Rp 2,000
- [x] Pickup (semua) → Free

### Payment Flow

- [x] Transfer → Upload bukti → Admin verify → Process
- [x] Cash → Direct process → Kurir confirm → Hand over

### Status Flow

- [x] Transfer: ORDERED → PAYMENT_PENDING → PROCESSED
- [x] Cash: ORDERED → PROCESSED
- [x] Delivery: → ON_DELIVERY → COMPLETED
- [x] Pickup: → READY → COMPLETED

---

## 🐛 Debug Commands

```bash
# View database
npx prisma studio

# Check orders
# → Verify: status, isMember, deliveryFee

# Check payments
# → Verify: status, proofImage, verifiedAt, courierHandedAt

# Check uploaded images
ls -la public/uploads/payment-proofs/

# Check logs
# Browser console + Terminal output
```

---

## 📝 Expected Behavior

### Upload Payment Proof

- Max size: 5MB
- Format: jpg, png, webp
- Saved to: /public/uploads/payment-proofs/
- Order status → PAYMENT_PENDING

### Admin Verify

- Approve → Payment: VERIFIED, Order: PROCESSED
- Reject → Payment: FAILED, Order: CANCELLED

### Courier Cash Handover

- Shows only PAID payments
- Updates to HANDED_OVER
- Records courier ID & timestamp

### Member totalOrders

- Increments ONLY on order COMPLETED
- Guest orders don't increment

---

**Full Testing Guide:** See `TESTING_GUIDE.md`
**Implementation Docs:** See `PAYMENT_FLOW_IMPLEMENTATION.md`
