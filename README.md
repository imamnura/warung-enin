# 🍽️ Warung Enin - Digital Platform

> **Rasa Rumahan, Kualitas Juara** - Platform digitalisasi untuk Warung Enin di Taraju, Kabupaten Tasikmalaya

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Struktur Folder](#-struktur-folder)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Design System](#-design-system)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Phase Development](#-phase-development)

---

## 🎯 Tentang Project

Warung Enin adalah platform digitalisasi untuk warung nasi tradisional yang menyediakan berbagai menu seperti:

- 🍚 Nasi & Lauk Pauk
- 🍜 Bakso
- 🍲 Soto
- 🍗 Ayam (Penyet, Bakar, dll)
- 🍝 Mie
- 🥤 Minuman

**Tujuan:**

- Digitalisasi promosi dan pemesanan
- Efisiensi operasional warung
- Multiple payment methods (Cash, QRIS, E-wallet)
- Real-time order tracking
- Dashboard management untuk admin

---

## ✨ Fitur Utama

### Customer-Facing

- [x] Browse menu dengan kategori
- [x] Filter & search menu
- [x] Shopping cart
- [x] Checkout (Dine-in / Take-away / Delivery)
- [x] Order tracking dengan status real-time
- [ ] Multiple payment methods
- [ ] User authentication
- [ ] Order history
- [ ] Review & rating

### Admin Dashboard

- [x] Overview & analytics
- [x] Order management
- [x] Menu management (CRUD)
- [ ] Customer list
- [ ] Courier management
- [ ] Payment tracking
- [ ] Reports & exports
- [ ] Notification system

---

## 🛠 Tech Stack

### Frontend

- **Framework:** Next.js 15.5.6 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x
- **Animation:** Framer Motion 12.x
- **Icons:** Lucide React
- **Form:** React Hook Form + Zod
- **Utils:** clsx, tailwind-merge

### Backend

- **Database:** PostgreSQL
- **ORM:** Prisma 6.19.0
- **API:** Next.js Server Actions
- **Validation:** Zod schemas

### DevOps

- **Package Manager:** pnpm
- **Deployment:** Vercel
- **Database:** Supabase / Railway / Neon

---

## 📁 Struktur Folder

```
warung-enin/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── reservation/       # Order page
│   │   ├── track/             # Order tracking
│   │   └── dashboard/         # Admin dashboard
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── constants.ts       # App constants
│   │   └── utils/             # Utility functions
│   ├── modules/               # Feature modules
│   │   ├── menu/
│   │   └── order/
│   ├── shared/ui/             # Reusable components
│   └── types/                 # TypeScript types
├── .env.example               # Env template
├── tailwind.config.ts         # Tailwind config
├── PRD.md                     # Product Requirements
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL

### Installation

1. **Clone & Install**

   ```bash
   git clone <repository-url>
   cd warung-enin
   pnpm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env dengan database URL Anda
   ```

3. **Database Setup**

   ```bash
   pnpm db:generate
   pnpm db:push
   ```

4. **Run Development**

   ```bash
   pnpm dev
   # Open http://localhost:3000
   ```

5. **Seed Data** (Optional)
   - Buka `/dashboard`
   - Klik "Seed Menus"

---

## 💻 Development

### Scripts

```bash
pnpm dev              # Development server
pnpm build            # Production build
pnpm start            # Production server
pnpm db:generate      # Generate Prisma Client
pnpm db:push          # Push schema changes
pnpm db:migrate       # Create migrations
pnpm db:studio        # Open Prisma Studio
pnpm lint             # Lint code
```

---

## 🎨 Design System

### Colors

**Brand Gradient (Merah & Kuning)**

- Primary: `#FBBF24` → `#F59E0B`
- Secondary: `#EF4444` → `#DC2626`

```css
.gradient-primary {
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444, #dc2626);
}
```

### Components

Located in `src/shared/ui/`:

- Button, Input, Textarea, Select
- Card, Modal, Toast
- Badge, Loading, Spinner

---

## 🗃️ Database Schema

### Models

- **User** - Customers & Admins
- **Menu** - Food items
- **Order** - Transactions
- **OrderItem** - Order details
- **Payment** - Payment records
- **Courier** - Delivery staff
- **Review** - Menu reviews
- **Notification** - Alerts
- **Settings** - App config

See `prisma/schema.prisma` for details.

---

## 📦 Deployment

### Vercel

```bash
vercel
# Set DATABASE_URL in environment variables
vercel --prod
```

---

## 📅 Phase Development

### ✅ Phase 0: Refactoring (COMPLETED)

- [x] Audit codebase
- [x] Setup design system
- [x] Refactor database schema
- [x] Create utilities & helpers
- [x] Build component library
- [x] Documentation

### 🔄 Phase 1: MVP (Current - Week 1-8)

- [ ] Complete admin features
- [ ] Payment integration
- [ ] WhatsApp notifications
- [ ] Testing & deployment

### 📌 Phase 2: Enhancement (Week 9-16)

- [ ] User authentication
- [ ] Review system
- [ ] Promo codes
- [ ] Advanced analytics

### 🚀 Phase 3: Scale (Week 17-24)

- [ ] PWA
- [ ] GPS tracking
- [ ] Loyalty program
- [ ] Multi-branch support

See [PRD.md](./PRD.md) for complete roadmap.

---

## 📞 Contact

**Warung Enin**

- 📍 Taraju, Kabupaten Tasikmalaya
- 📱 08xxxxxxxxxx
- 📷 @warnas_enin

---

**Made with ❤️ for Warung Enin**
