# Product Requirements Document (PRD)

## Warung Enin - Digital Platform

---

## 📋 Executive Summary

**Project Name:** Warung Enin Digital Platform  
**Version:** 1.0.0  
**Location:** Taraju, Kabupaten Tasikmalaya  
**Last Updated:** 4 Desember 2025

Warung Enin adalah platform digitalisasi untuk warung nasi tradisional yang menyediakan berbagai menu seperti lauk pauk, bakso, soto, ayam penyet, dan menu lainnya. Platform ini bertujuan untuk memodernisasi proses promosi, pemesanan, pembayaran, dan manajemen operasional warung.

---

## 🎯 Business Objectives

1. **Digitalisasi Promosi** - Meningkatkan visibilitas warung melalui platform online
2. **Efisiensi Operasional** - Mempermudah admin dalam mengelola pesanan, menu, dan delivery
3. **Kemudahan Pembayaran** - Menyediakan berbagai metode pembayaran digital (QRIS, GoPay, ShopeePay, OVO, DANA)
4. **Real-time Monitoring** - Tracking pesanan dan notifikasi otomatis
5. **Data-Driven Decisions** - Dashboard analytics untuk insights bisnis

---

## 👥 Target Users

### 1. **Customers**

- Pelanggan lokal di area Taraju dan sekitarnya
- Usia: 15-55 tahun
- Familiar dengan smartphone dan aplikasi mobile

### 2. **Admin/Owner**

- Pemilik warung
- Staff operasional
- Kurir/delivery partner

---

## 🎨 Design System

### Theme & Branding

- **Primary Colors:**
  - Merah: `#DC2626` → `#EF4444` (gradient)
  - Kuning: `#F59E0B` → `#FBBF24` (gradient)
- **Brand Gradient:** `bg-gradient-to-br from-red-600 via-red-500 to-yellow-500`
- **Typography:**
  - Heading: Font bold, uppercase untuk menu categories
  - Body: Readable, clean sans-serif
- **Animation:** Framer Motion untuk smooth transitions dan micro-interactions

### UI/UX Principles

- Mobile-first responsive design
- Clean, intuitive navigation
- Fast loading dengan optimized images
- Accessibility standards (WCAG 2.1)
- Consistent spacing dan visual hierarchy

---

## 🏗️ Technical Stack

### Frontend

- **Framework:** Next.js 15.5.6 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x
- **Animation:** Framer Motion 12.23.25
- **State Management:** React Hooks + Server Components
- **Form Handling:** React Hook Form (to be added)
- **Validation:** Zod (to be added)

### Backend

- **API:** Next.js API Routes / Server Actions
- **Database:** PostgreSQL/MySQL via Prisma 6.19.0
- **ORM:** Prisma Client
- **Authentication:** NextAuth.js (to be added)
- **File Upload:** Next.js built-in (to be added)

### Payment Integration

- **QRIS:** Midtrans/Xendit (free tier initially)
- **E-Wallet:** GoPay, ShopeePay, OVO, DANA via Midtrans
- **Cash:** Manual confirmation system

### Notifications

- **WhatsApp:** WhatsApp Business API (free tier/unofficial)
- **In-App:** Real-time via Polling/WebSocket
- **Email:** Resend/NodeMailer (to be added)

### Deployment

- **Hosting:** Vercel (free tier)
- **Database:** Supabase/Railway/Neon (free tier)
- **CDN:** Vercel Edge Network
- **Domain:** Custom domain (to be configured)

---

## 📱 Feature Requirements

### Phase 1: MVP (Minimum Viable Product) - Bulan 1-2

#### 1.1 Customer-Facing Features

##### **Homepage**

- [ ] Hero section dengan brand gradient dan animasi
- [ ] Featured menu showcase
- [ ] Operating hours display
- [ ] Location map integration (Google Maps)
- [ ] Contact information
- [ ] Gallery warung dan menu
- [ ] Testimonials section

##### **Menu Catalog (E-Commerce Style)**

- [ ] Grid/List view toggle
- [ ] Category filters (Nasi, Lauk, Bakso, Soto, Minuman, dll)
- [ ] Search functionality
- [ ] Price display dengan format Rupiah
- [ ] Menu availability status (tersedia/habis)
- [ ] Menu detail modal/page
  - High-quality images
  - Description
  - Price
  - Ingredients/composition
  - Spicy level indicator
  - Allergen information
- [ ] Add to cart dengan animasi
- [ ] Floating cart button dengan item count badge

##### **Shopping Cart**

- [ ] Cart items list
- [ ] Quantity adjustment (+/-)
- [ ] Remove item dengan konfirmasi
- [ ] Subtotal calculation
- [ ] Notes untuk setiap item
- [ ] Minimum order notification
- [ ] Empty cart state

##### **Checkout Process**

- [ ] Customer information form
  - Nama
  - Nomor telepon
  - Alamat (untuk delivery)
- [ ] Order type selection (Dine-in/Take-away/Delivery)
- [ ] Delivery address validation
- [ ] Delivery fee calculation (jika delivery)
- [ ] Order notes/special requests
- [ ] Payment method selection
  - Cash on Delivery
  - QRIS
  - GoPay
  - ShopeePay
  - OVO
  - DANA
- [ ] Order summary
- [ ] Terms & conditions checkbox
- [ ] Place order button dengan loading state

##### **Order Tracking**

- [ ] Order status timeline dengan animasi
  - Pesanan Diterima
  - Sedang Diproses
  - Sedang Dikirim (jika delivery)
  - Selesai
- [ ] Real-time status updates (polling setiap 30 detik)
- [ ] Estimated delivery time
- [ ] Courier information (nama, nomor telepon)
- [ ] Live location tracking (Phase 2)
- [ ] Order receipt download (PDF)

##### **User Account (Phase 1.5)**

- [ ] Sign up / Login
- [ ] Profile management
- [ ] Order history
- [ ] Saved addresses
- [ ] Favorite menu items

#### 1.2 Admin Dashboard Features

##### **Dashboard Overview**

- [ ] Metrics cards dengan gradient background
  - Total orders hari ini
  - Pending orders
  - Revenue hari ini
  - Completed orders
- [ ] Real-time order queue
- [ ] Recent orders table
- [ ] Quick actions
- [ ] Analytics charts (Chart.js/Recharts)
  - Daily sales trend (7 days)
  - Top selling menu items
  - Order type distribution (pie chart)
  - Payment method breakdown

##### **Order Management**

- [ ] Order list dengan filters
  - Status filter (All, Pending, Processing, Completed, Cancelled)
  - Date range filter
  - Payment status filter
  - Order type filter
- [ ] Pagination (10, 25, 50, 100 items per page)
- [ ] Search by order ID atau customer name
- [ ] Order detail view
- [ ] Status update dengan confirmation
- [ ] Print order receipt
- [ ] Cancel order dengan reason
- [ ] Bulk actions
- [ ] Export to Excel/CSV
- [ ] Auto-refresh setiap 30 detik
- [ ] Sound notification untuk order baru

##### **Menu Management**

- [ ] Menu list dengan grid/table view
- [ ] Add new menu
  - Upload gambar (multiple images)
  - Nama menu
  - Kategori
  - Deskripsi
  - Harga
  - Status (available/unavailable)
  - Stock quantity
  - Preparation time
- [ ] Edit menu
- [ ] Delete menu dengan konfirmasi
- [ ] Bulk update availability
- [ ] Category management
- [ ] Drag & drop untuk reorder menu
- [ ] Image optimization otomatis

##### **Customer Management**

- [ ] Customer list dengan pagination
- [ ] Customer detail
  - Order history
  - Total spending
  - Preferred payment method
  - Contact info
- [ ] Search customer
- [ ] Export customer data
- [ ] Customer segments (Top Customers, New Customers, dll)

##### **Courier Management**

- [ ] Courier list
- [ ] Add/Edit/Delete courier
  - Nama
  - Nomor telepon
  - Status (Active/Inactive)
  - Vehicle type
- [ ] Assign courier to order
- [ ] Courier performance metrics
  - Total deliveries
  - Average delivery time
  - Customer ratings

##### **Payment Management**

- [ ] Payment transactions list
- [ ] Payment status tracking
  - Pending
  - Paid
  - Failed
  - Refunded
- [ ] Payment method breakdown
- [ ] Daily/Weekly/Monthly revenue report
- [ ] Payment reconciliation
- [ ] Generate invoice
- [ ] Payment proof upload/view

##### **Reports & Analytics**

- [ ] Sales report
  - Daily/Weekly/Monthly/Yearly view
  - Revenue chart dengan gradient
  - Order volume chart
  - Average order value
- [ ] Menu performance report
  - Best sellers
  - Slow movers
  - Out of stock frequency
- [ ] Customer analytics
  - New vs returning customers
  - Customer lifetime value
  - Peak order times heatmap
- [ ] Delivery analytics
  - Average delivery time
  - Delivery areas map
  - Courier efficiency
- [ ] Export all reports to PDF/Excel

##### **Settings**

- [ ] Store information
  - Nama warung
  - Logo upload
  - Address
  - Phone number
  - Operating hours
  - Social media links
- [ ] Delivery settings
  - Delivery radius
  - Delivery fee rules
  - Minimum order amount
- [ ] Payment gateway configuration
- [ ] Notification settings
  - WhatsApp notification toggle
  - Email notification toggle
  - Sound notification toggle
- [ ] Tax & service charge settings
- [ ] Admin user management (Phase 2)

#### 1.3 Notification System

##### **WhatsApp Notifications (Free Unofficial API)**

- [ ] New order notification to admin
  - Order ID
  - Customer name
  - Total amount
  - Order items summary
  - Order type
- [ ] Order status update to customer
  - Pesanan diterima
  - Sedang diproses
  - Sedang dikirim
  - Pesanan selesai
- [ ] Payment confirmation
- [ ] Daily sales summary to owner

##### **In-App Notifications**

- [ ] Bell icon dengan badge counter
- [ ] Notification dropdown
- [ ] Mark as read/unread
- [ ] Notification history
- [ ] Push notification via browser API

---

### Phase 2: Enhanced Features - Bulan 3-4

#### 2.1 Advanced Customer Features

- [ ] **Loyalty Program**
  - Point system
  - Rewards catalog
  - Referral program
- [ ] **Promo & Discounts**
  - Coupon codes
  - Flash sales
  - Bundle deals
  - First-time customer discount
- [ ] **Review & Rating**
  - Rate menu items
  - Upload photo review
  - Reply to reviews (admin)
- [ ] **Wishlist/Favorites**
- [ ] **Pre-order scheduling**
  - Schedule order untuk waktu tertentu
- [ ] **Live Chat** (Tawk.to/free solution)

#### 2.2 Advanced Admin Features

- [ ] **Inventory Management**
  - Stock tracking
  - Low stock alerts
  - Ingredient management
  - Auto-reorder suggestions
- [ ] **Staff Management**
  - Multi-user with roles & permissions
  - Activity logs
  - Shift scheduling
- [ ] **Marketing Tools**
  - Promo campaign creator
  - Email/SMS blast
  - Social media post scheduler
- [ ] **Advanced Analytics**
  - Forecasting & predictions
  - Profit margin analysis
  - Customer segmentation AI
  - Automated reports via email

#### 2.3 Advanced Technical Features

- [ ] **Real-time GPS Tracking** (Google Maps API)
- [ ] **WebSocket for real-time updates**
- [ ] **PWA (Progressive Web App)**
  - Install to home screen
  - Offline mode
  - Push notifications
- [ ] **Multi-language support** (ID/EN)
- [ ] **Dark mode**
- [ ] **Voice search**

---

### Phase 3: Scale & Optimization - Bulan 5-6

#### 3.1 Business Scaling

- [ ] **Multi-branch support**
  - Branch selection
  - Branch-specific menu & pricing
  - Centralized reporting
- [ ] **Franchise system**
- [ ] **B2B/Catering orders**
  - Bulk order discounts
  - Custom quotation
- [ ] **Subscription meal plans**

#### 3.2 Technical Optimization

- [ ] **Performance optimization**
  - Image CDN
  - Code splitting
  - Lazy loading
  - Caching strategy
- [ ] **SEO optimization**
  - Meta tags optimization
  - Structured data (JSON-LD)
  - Sitemap generation
  - Blog/content marketing
- [ ] **Security enhancements**
  - Rate limiting
  - CSRF protection
  - SQL injection prevention
  - XSS protection
  - Regular security audits
- [ ] **Monitoring & Logging**
  - Error tracking (Sentry)
  - Analytics (Google Analytics)
  - Performance monitoring (Vercel Analytics)
  - User behavior tracking (Hotjar)

#### 3.3 Advanced Integrations

- [ ] **Accounting software integration** (Jurnal, Accurate)
- [ ] **Social media integration**
  - Order via Instagram/Facebook
  - Auto-post menu updates
- [ ] **Third-party delivery** (GoFood, GrabFood)

---

## 🗄️ Database Schema

### Core Tables (Already in schema.prisma)

- **User** - Customer & Admin data
- **Menu** - Menu items catalog
- **Order** - Order transactions
- **OrderItem** - Order line items
- **Payment** - Payment records
- **Courier** - Delivery personnel

### Additional Tables (To be added)

```prisma
// Category untuk menu
model Category {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  image       String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  menus       Menu[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Review & Rating
model Review {
  id         String   @id @default(uuid())
  menuId     String
  userId     String
  rating     Int      // 1-5
  comment    String?
  images     String[] // Array of image URLs
  isVerified Boolean  @default(false)
  menu       Menu     @relation(fields: [menuId], references: [id])
  user       User     @relation(fields: [userId], references: [id])
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// Promo & Discount
model Promo {
  id          String    @id @default(uuid())
  code        String    @unique
  name        String
  description String?
  type        PromoType // PERCENTAGE, FIXED_AMOUNT, FREE_DELIVERY
  value       Float
  minOrder    Float?
  maxDiscount Float?
  startDate   DateTime
  endDate     DateTime
  usageLimit  Int?
  usageCount  Int       @default(0)
  isActive    Boolean   @default(true)
  orders      Order[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum PromoType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_DELIVERY
}

// Notification
model Notification {
  id        String           @id @default(uuid())
  userId    String?
  type      NotificationType
  title     String
  message   String
  data      Json?
  isRead    Boolean          @default(false)
  user      User?            @relation(fields: [userId], references: [id])
  createdAt DateTime         @default(now())
}

enum NotificationType {
  NEW_ORDER
  ORDER_STATUS
  PAYMENT_SUCCESS
  PAYMENT_FAILED
  PROMO
  SYSTEM
}

// Settings
model Settings {
  id                String   @id @default(uuid())
  storeName         String
  storeAddress      String
  storePhone        String
  storeLogo         String?
  deliveryRadius    Float    @default(5) // dalam km
  deliveryFee       Float    @default(5000)
  minOrder          Float    @default(15000)
  taxPercentage     Float    @default(0)
  serviceCharge     Float    @default(0)
  whatsappNumber    String?
  isOpen            Boolean  @default(true)
  openingHour       String?
  closingHour       String?
  updatedAt         DateTime @updatedAt
}
```

---

## 🔄 User Flows

### Customer Order Flow

1. Browse menu → Add to cart
2. Checkout → Fill delivery info
3. Select payment method
4. Confirm order
5. Receive WhatsApp confirmation
6. Track order status
7. Receive order
8. (Optional) Rate & review

### Admin Order Processing Flow

1. Receive notification (sound + WhatsApp)
2. Review order details
3. Confirm order
4. Update status: "Processing"
5. Prepare order
6. Assign courier (if delivery)
7. Update status: "On Delivery"
8. Update status: "Completed"
9. Confirm payment received

---

## 📊 Key Performance Indicators (KPIs)

### Business Metrics

- **Daily Revenue**
- **Average Order Value (AOV)**
- **Order Conversion Rate**
- **Customer Retention Rate**
- **Peak Order Times**

### Technical Metrics

- **Page Load Time** (Target: < 2s)
- **API Response Time** (Target: < 500ms)
- **Uptime** (Target: 99.9%)
- **Error Rate** (Target: < 0.1%)

---

## 🚀 Development Phases

### **Phase 1: Foundation & MVP** (Week 1-8)

#### Week 1-2: Setup & Infrastructure

- [ ] Project initialization & configuration
- [ ] Database schema design & migration
- [ ] Component library setup (UI components)
- [ ] Authentication setup (NextAuth.js)
- [ ] Design system implementation (colors, typography, spacing)
- [ ] Layout components (Header, Footer, Sidebar)

#### Week 3-4: Customer-Facing Core

- [ ] Homepage dengan hero & menu showcase
- [ ] Menu catalog dengan filtering & search
- [ ] Menu detail page
- [ ] Shopping cart functionality
- [ ] Checkout flow
- [ ] Basic order tracking page

#### Week 5-6: Admin Dashboard Core

- [ ] Dashboard layout & navigation
- [ ] Overview/analytics dashboard
- [ ] Order management (list, detail, status update)
- [ ] Menu management (CRUD operations)
- [ ] Basic notification system

#### Week 7-8: Payment & Delivery

- [ ] Payment gateway integration (QRIS, E-wallet)
- [ ] Cash payment flow
- [ ] Courier management
- [ ] Order assignment to courier
- [ ] WhatsApp notification integration
- [ ] Testing & bug fixes
- [ ] MVP deployment to Vercel

**Deliverables:**

- Functional e-commerce website
- Basic admin dashboard
- Order & payment processing
- WhatsApp notifications

---

### **Phase 2: Enhancement & Features** (Week 9-16)

#### Week 9-10: Customer Experience

- [ ] User authentication & profile
- [ ] Order history
- [ ] Saved addresses
- [ ] Review & rating system
- [ ] Wishlist/favorites
- [ ] Improved animations & micro-interactions

#### Week 11-12: Advanced Admin

- [ ] Customer management dashboard
- [ ] Payment reconciliation
- [ ] Advanced analytics & reports
- [ ] Export functionality (PDF, Excel)
- [ ] Inventory management
- [ ] Promo & discount management

#### Week 13-14: Marketing & Engagement

- [ ] Loyalty program
- [ ] Coupon system
- [ ] Email notifications
- [ ] Social media integration
- [ ] Blog/content section
- [ ] SEO optimization

#### Week 15-16: Polish & Optimization

- [ ] Performance optimization
- [ ] Mobile UX improvements
- [ ] Accessibility audit & fixes
- [ ] Security hardening
- [ ] Load testing
- [ ] User acceptance testing (UAT)

**Deliverables:**

- Complete feature set
- Optimized performance
- Marketing tools
- Production-ready platform

---

### **Phase 3: Scale & Growth** (Week 17-24)

#### Week 17-18: PWA & Mobile

- [ ] Progressive Web App setup
- [ ] Offline mode
- [ ] Push notifications
- [ ] Install prompt
- [ ] Mobile app-like experience

#### Week 19-20: Advanced Features

- [ ] Real-time GPS tracking
- [ ] WebSocket implementation
- [ ] Voice search
- [ ] Multi-language support
- [ ] Dark mode

#### Week 21-22: Business Scaling

- [ ] Multi-branch support
- [ ] Staff management & roles
- [ ] Advanced inventory with alerts
- [ ] Forecasting & predictions
- [ ] B2B/Catering module

#### Week 23-24: Monitoring & Maintenance

- [ ] Error tracking setup (Sentry)
- [ ] Analytics dashboard (Google Analytics)
- [ ] Performance monitoring
- [ ] Automated backup system
- [ ] Documentation & training materials
- [ ] Handover & support plan

**Deliverables:**

- Scalable platform
- PWA capabilities
- Advanced business features
- Monitoring & maintenance systems

---

## 💰 Budget Considerations (Free/Low-Cost Stack)

### Free Tier Services

- **Hosting:** Vercel (Free tier - unlimited bandwidth)
- **Database:** Supabase/Neon (Free tier - 500MB)
- **Payment:** Midtrans (No monthly fee, transaction-based)
- **WhatsApp:** Unofficial API (Free, may have limitations)
- **Analytics:** Google Analytics (Free)
- **Error Tracking:** Sentry (Free tier - 5K events/month)
- **Email:** Resend (Free tier - 3K emails/month)
- **Maps:** Google Maps (Free tier - $200 credit/month)

### Future Paid Services (When Scaling)

- **WhatsApp Business API:** ~$0.005-0.05 per message
- **Database:** ~$10-25/month (for larger data)
- **Payment Gateway:** Transaction fees only (2-3%)
- **SMS Gateway:** ~Rp 200-300 per SMS
- **Premium Domain:** ~Rp 150K/year

---

## 🎨 UI/UX Mockup Guidelines

### Color Palette

```css
/* Primary Gradient */
--gradient-primary: linear-gradient(
  135deg,
  #dc2626 0%,
  #ef4444 50%,
  #f59e0b 100%
);

/* Colors */
--red-600: #dc2626;
--red-500: #ef4444;
--red-400: #f87171;
--yellow-600: #f59e0b;
--yellow-500: #fbbf24;
--yellow-400: #fcd34d;

/* Neutrals */
--gray-900: #111827;
--gray-800: #1f2937;
--gray-700: #374151;
--gray-100: #f3f4f6;
--white: #ffffff;
```

### Animation Examples

```typescript
// Button hover animation
const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

// Card entrance animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Gradient animation
const gradientVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { duration: 5, repeat: Infinity },
  },
};
```

---

## 🔒 Security Considerations

1. **Input Validation:** Zod schema validation untuk semua forms
2. **SQL Injection Prevention:** Prisma ORM handles this
3. **XSS Protection:** Next.js built-in protection
4. **CSRF Protection:** NextAuth.js + SameSite cookies
5. **Rate Limiting:** Implement untuk API routes
6. **Environment Variables:** Jangan commit sensitive data
7. **HTTPS Only:** Enforce SSL di production
8. **Payment Security:** PCI DSS compliance via payment gateway
9. **Authentication:** Secure password hashing (bcrypt)
10. **Data Privacy:** GDPR-compliant data handling

---

## 📈 Success Metrics

### Phase 1 Success Criteria

- [ ] 50+ menu items katalog
- [ ] 10+ successful test orders
- [ ] < 3 second page load time
- [ ] Mobile responsive 100%
- [ ] Zero critical bugs

### Phase 2 Success Criteria

- [ ] 100+ registered customers
- [ ] 50+ daily orders
- [ ] 4.5+ average rating
- [ ] 80% customer retention
- [ ] 90% uptime

### Phase 3 Success Criteria

- [ ] 500+ registered customers
- [ ] 200+ daily orders
- [ ] Multiple branch support
- [ ] 99.9% uptime
- [ ] Profitable operations

---

## 🤝 Recommendations for Growth

### Short-term (3-6 months)

1. **Social Media Marketing**

   - Instagram food photos
   - Facebook local groups
   - TikTok trending menu
   - Google My Business optimization

2. **Customer Acquisition**

   - First-time customer discount (20%)
   - Referral program (Rp 10K for both)
   - Local influencer collaboration
   - Flyer distribution di area Taraju

3. **Menu Strategy**
   - Daily specials/promo
   - Paket hemat (bundling)
   - Seasonal menu
   - Feedback-driven improvements

### Mid-term (6-12 months)

1. **Partnership**

   - Corporate catering contracts
   - School/university meal plans
   - Event catering services
   - Local delivery aggregators

2. **Expansion**

   - Ghost kitchen setup
   - Second branch evaluation
   - Franchising model development
   - Regional market research

3. **Technology**
   - Mobile app (React Native)
   - Kitchen display system
   - Inventory automation
   - AI-powered recommendations

### Long-term (1-2 years)

1. **Brand Development**

   - Warung Enin franchise package
   - Central kitchen facility
   - Frozen food product line
   - National brand recognition

2. **Diversification**

   - Catering service expansion
   - Food truck/pop-up events
   - Retail packaged products
   - Cooking class/workshop

3. **Innovation**
   - Subscription meal plans
   - Virtual kitchen network
   - B2B white-label platform
   - Food tech incubator

---

## 📝 Next Steps

### Immediate Actions

1. ✅ **PRD Review & Approval** - Review document ini
2. [ ] **Design Mockups** - Create Figma designs
3. [ ] **Database Finalization** - Complete Prisma schema
4. [ ] **Development Kickoff** - Start Phase 1 Week 1

### Week 1 Tasks

- [ ] Setup Tailwind config dengan color palette
- [ ] Create base components (Button, Card, Input, dll)
- [ ] Setup Framer Motion
- [ ] Database migration
- [ ] Authentication boilerplate

---

## 📞 Contact & Support

**Project Owner:** Warung Enin  
**Location:** Taraju, Kabupaten Tasikmalaya  
**Development Start:** Desember 2025  
**Target Launch:** Februari 2026 (Phase 1)

---

## 📄 Document History

| Version | Date       | Changes     | Author       |
| ------- | ---------- | ----------- | ------------ |
| 1.0.0   | 4 Dec 2025 | Initial PRD | AI Assistant |

---

## ✅ Approval

- [ ] Product Owner Approval
- [ ] Technical Lead Approval
- [ ] Design Lead Approval
- [ ] Stakeholder Sign-off

---

**Note:** Document ini adalah living document dan akan di-update seiring development progress. Semua fitur disesuaikan dengan budget dan timeline yang realistis, menggunakan free-tier services sebanyak mungkin untuk meminimalisir cost di tahap awal.
