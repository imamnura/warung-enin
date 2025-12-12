import "../prisma.config"; // Load env vars
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Decimal } from "@prisma/client/runtime/library";

async function main() {
  console.log("🌱 Starting comprehensive seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("Clearing existing data...");
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.address.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.courier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.promo.deleteMany();

  // Create Admin User
  console.log("Creating admin user...");
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin Warung Enin",
      phone: "081234567890",
      email: "admin@warungenin.com",
      password: hashedAdminPassword,
      role: "ADMIN",
      address: "Taraju, Kabupaten Tasikmalaya, Jawa Barat",
    },
  });

  // Create Test Admin for Testing
  console.log("Creating test admin...");
  const testAdmin = await prisma.user.create({
    data: {
      id: "admin-test-id",
      name: "Admin Test",
      phone: "081111111111",
      email: "admin@warung.com",
      password: hashedAdminPassword,
      role: "ADMIN",
      address: "Test Address",
      totalOrders: 0,
    },
  });

  // Create Test Courier for Testing
  console.log("Creating test courier...");
  const hashedCourierPassword = await bcrypt.hash("kurir123", 10);
  const testCourier = await prisma.user.create({
    data: {
      id: "courier-test-id",
      name: "Kurir Test",
      phone: "082222222222",
      email: "kurir@warung.com",
      password: hashedCourierPassword,
      role: "COURIER",
      address: "Test Courier Address",
      totalOrders: 0,
    },
  });

  // Create Customer Users
  console.log("Creating customers...");
  const hashedPassword = await bcrypt.hash("customer123", 10);

  // Create Test Member for Testing
  console.log("Creating test member...");
  const hashedMemberPassword = await bcrypt.hash("password123", 10);
  const testMember = await prisma.user.create({
    data: {
      id: "member-test-id",
      name: "Test Member",
      phone: "081999888777",
      email: "member@test.com",
      password: hashedMemberPassword,
      role: "CUSTOMER",
      address: "Jl. Test Member No. 123",
      memberSince: new Date(),
      totalOrders: 0,
    },
  });

  const customers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Budi Santoso",
        phone: "081298765432",
        email: "budi@example.com",
        password: hashedPassword,
        role: "CUSTOMER",
        address: "Jl. Merdeka No. 123, Tasikmalaya",
      },
    }),
    prisma.user.create({
      data: {
        name: "Siti Rahayu",
        phone: "082187654321",
        email: "siti@example.com",
        password: hashedPassword,
        role: "CUSTOMER",
        address: "Jl. Sudirman No. 45, Tasikmalaya",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ahmad Ridwan",
        phone: "085312345678",
        email: "ahmad@example.com",
        password: hashedPassword,
        role: "CUSTOMER",
        address: "Jl. Ahmad Yani No. 78, Tasikmalaya",
      },
    }),
    prisma.user.create({
      data: {
        name: "Dewi Lestari",
        phone: "087654321098",
        email: "dewi@example.com",
        password: hashedPassword,
        role: "CUSTOMER",
        address: "Jl. Pahlawan No. 99, Tasikmalaya",
      },
    }),
  ]);

  // Create Couriers
  console.log("Creating couriers...");
  const couriers = await Promise.all([
    prisma.courier.create({
      data: {
        name: "Dedi Kurniawan",
        phone: "081345678901",
        vehicle: "Motor Honda Beat",
        isActive: true,
      },
    }),
    prisma.courier.create({
      data: {
        name: "Eko Prasetyo",
        phone: "082456789012",
        vehicle: "Motor Yamaha Mio",
        isActive: true,
      },
    }),
    prisma.courier.create({
      data: {
        name: "Faisal Rahman",
        phone: "083567890123",
        vehicle: "Motor Suzuki Nex",
        isActive: true,
      },
    }),
  ]);

  // Create Menus
  console.log("Creating menus...");
  const menus = await Promise.all([
    prisma.menu.create({
      data: {
        name: "Nasi Ayam Penyet",
        description:
          "Ayam goreng penyet dengan sambal terasi pedas, lalapan segar, dan nasi putih pulen",
        price: new Decimal(25000),
        category: "AYAM",
        images: [
          "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500",
        ],
        isAvailable: true,
        isPopular: true,
        prepTime: 15,
        spicyLevel: 4,
        stock: 30,
      },
    }),
    prisma.menu.create({
      data: {
        name: "Bakso Spesial",
        description:
          "Bakso sapi jumbo dengan tahu, mie kuning, dan kuah kaldu segar",
        price: new Decimal(20000),
        category: "BAKSO",
        images: [
          "https://images.unsplash.com/photo-1558030006-450675393462?w=500",
        ],
        isAvailable: true,
        isPopular: true,
        prepTime: 10,
        spicyLevel: 1,
        stock: 40,
      },
    }),
    prisma.menu.create({
      data: {
        name: "Soto Ayam",
        description:
          "Soto ayam kuning dengan taburan bawang goreng, kerupuk, dan sambal",
        price: new Decimal(18000),
        category: "SOTO",
        images: [
          "https://images.unsplash.com/photo-1604908177234-5e88c4bc8cb9?w=500",
        ],
        isAvailable: true,
        isPopular: true,
        prepTime: 12,
        spicyLevel: 2,
        stock: 35,
      },
    }),
    prisma.menu.create({
      data: {
        name: "Nasi Goreng Spesial",
        description:
          "Nasi goreng dengan telur, ayam suwir, sayuran, dan kerupuk",
        price: new Decimal(22000),
        category: "NASI",
        images: [
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
        ],
        isAvailable: true,
        isPopular: true,
        prepTime: 15,
        spicyLevel: 2,
        stock: 50,
      },
    }),
    prisma.menu.create({
      data: {
        name: "Mie Goreng Pedas",
        description: "Mie goreng pedas dengan sayuran dan telur mata sapi",
        price: new Decimal(15000),
        category: "MIE",
        images: [
          "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500",
        ],
        isAvailable: true,
        prepTime: 10,
        spicyLevel: 3,
        stock: 45,
      },
    }),
    prisma.menu.create({
      data: {
        name: "Ayam Bakar Madu",
        description:
          "Ayam bakar dengan bumbu madu pedas manis khas Warung Enin",
        price: new Decimal(28000),
        category: "AYAM",
        images: [
          "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500",
        ],
        isAvailable: true,
        isPopular: true,
        prepTime: 20,
        spicyLevel: 2,
        stock: 25,
      },
    }),
    prisma.menu.create({
      data: {
        name: "Nasi Rawon",
        description:
          "Rawon daging sapi dengan keluwak hitam, tauge, dan telur asin",
        price: new Decimal(24000),
        category: "NASI",
        images: [
          "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=500",
        ],
        isAvailable: true,
        prepTime: 18,
        spicyLevel: 1,
        stock: 20,
      },
    }),
    prisma.menu.create({
      data: {
        name: "Es Jeruk Peras",
        description: "Jus jeruk segar diperas langsung dengan es batu",
        price: new Decimal(8000),
        category: "MINUMAN",
        images: [
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500",
        ],
        isAvailable: true,
        prepTime: 5,
        spicyLevel: 0,
        stock: 100,
      },
    }),
    prisma.menu.create({
      data: {
        name: "Es Teh Manis",
        description: "Teh manis dingin segar",
        price: new Decimal(5000),
        category: "MINUMAN",
        images: [
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500",
        ],
        isAvailable: true,
        prepTime: 3,
        spicyLevel: 0,
        stock: 100,
      },
    }),
    prisma.menu.create({
      data: {
        name: "Es Kelapa Muda",
        description: "Kelapa muda segar dengan air kelapa dan daging kelapa",
        price: new Decimal(10000),
        category: "MINUMAN",
        images: [
          "https://images.unsplash.com/photo-1582195694785-e5fc96a2c01b?w=500",
        ],
        isAvailable: true,
        prepTime: 5,
        spicyLevel: 0,
        stock: 50,
      },
    }),
  ]);

  // Create Promos
  console.log("Creating promos...");
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await Promise.all([
    prisma.promo.create({
      data: {
        code: "DISKON50",
        name: "Diskon 50% Menu Pilihan",
        description:
          "Dapatkan diskon 50% untuk menu tertentu, maksimal Rp 25.000",
        type: "PERCENTAGE",
        value: new Decimal(50),
        minPurchase: new Decimal(50000),
        maxDiscount: new Decimal(25000),
        usageLimit: 100,
        perUserLimit: 1,
        startDate: now,
        endDate: nextWeek,
        isActive: true,
      },
    }),
    prisma.promo.create({
      data: {
        code: "GRATISONGKIR",
        name: "Gratis Ongkir",
        description:
          "Gratis ongkos kirim untuk semua pesanan minimal Rp 30.000",
        type: "FREE_DELIVERY",
        value: new Decimal(0),
        minPurchase: new Decimal(30000),
        usageLimit: 50,
        perUserLimit: 2,
        startDate: now,
        endDate: nextWeek,
        isActive: true,
      },
    }),
    prisma.promo.create({
      data: {
        code: "HEMAT20K",
        name: "Hemat 20 Ribu",
        description:
          "Potongan langsung Rp 20.000 untuk pembelian minimal Rp 100.000",
        type: "FIXED_AMOUNT",
        value: new Decimal(20000),
        minPurchase: new Decimal(100000),
        usageLimit: 30,
        perUserLimit: 1,
        startDate: now,
        endDate: nextWeek,
        isActive: true,
      },
    }),
    prisma.promo.create({
      data: {
        code: "WEEKEND30",
        name: "Diskon Weekend 30%",
        description:
          "Diskon 30% khusus akhir pekan, maksimal potongan Rp 15.000",
        type: "PERCENTAGE",
        value: new Decimal(30),
        minPurchase: new Decimal(40000),
        maxDiscount: new Decimal(15000),
        usageLimit: 75,
        perUserLimit: 3,
        startDate: now,
        endDate: nextMonth,
        isActive: true,
      },
    }),
    prisma.promo.create({
      data: {
        code: "NEWUSER",
        name: "Welcome Bonus Pelanggan Baru",
        description:
          "Selamat datang! Dapatkan diskon Rp 10.000 untuk pesanan pertama",
        type: "FIXED_AMOUNT",
        value: new Decimal(10000),
        minPurchase: new Decimal(25000),
        usageLimit: 200,
        perUserLimit: 1,
        startDate: now,
        endDate: nextMonth,
        isActive: true,
      },
    }),
  ]);

  // Create Addresses
  console.log("Creating addresses...");
  await Promise.all([
    prisma.address.create({
      data: {
        userId: customers[0].id,
        label: "Rumah",
        recipientName: customers[0].name,
        recipientPhone: customers[0].phone,
        address: "Jl. Merdeka No. 123, RT 01/RW 02",
        district: "Cihideung",
        city: "Tasikmalaya",
        province: "Jawa Barat",
        postalCode: "46122",
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: customers[1].id,
        label: "Rumah",
        recipientName: customers[1].name,
        recipientPhone: customers[1].phone,
        address: "Jl. Sudirman No. 45, RT 03/RW 04",
        district: "Tawang",
        city: "Tasikmalaya",
        province: "Jawa Barat",
        postalCode: "46123",
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: customers[2].id,
        label: "Rumah",
        recipientName: customers[2].name,
        recipientPhone: customers[2].phone,
        address: "Jl. Ahmad Yani No. 78, RT 02/RW 05",
        district: "Cipedes",
        city: "Tasikmalaya",
        province: "Jawa Barat",
        postalCode: "46124",
        isDefault: true,
      },
    }),
  ]);

  // Create Sample Orders
  console.log("Creating orders...");
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2024-001",
      customerId: customers[0].id,
      courierId: couriers[0].id,
      status: "COMPLETED",
      deliveryMethod: "DIANTAR",
      address: "Jl. Merdeka No. 123, Tasikmalaya",
      subtotal: new Decimal(43000),
      deliveryFee: new Decimal(5000),
      discount: new Decimal(0),
      totalPrice: new Decimal(48000),
      completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      items: {
        create: [
          {
            menuId: menus[0].id,
            quantity: 1,
            price: new Decimal(25000),
            subtotal: new Decimal(25000),
          },
          {
            menuId: menus[1].id,
            quantity: 1,
            price: new Decimal(20000),
            subtotal: new Decimal(20000),
          },
        ],
      },
      payment: {
        create: {
          amount: new Decimal(48000),
          method: "CASH",
          status: "PAID",
          paidAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2024-002",
      customerId: customers[1].id,
      courierId: couriers[1].id,
      status: "ON_DELIVERY",
      deliveryMethod: "DIANTAR",
      address: "Jl. Sudirman No. 45, Tasikmalaya",
      subtotal: new Decimal(36000),
      deliveryFee: new Decimal(5000),
      discount: new Decimal(0),
      totalPrice: new Decimal(41000),
      items: {
        create: [
          {
            menuId: menus[2].id,
            quantity: 2,
            price: new Decimal(18000),
            subtotal: new Decimal(36000),
          },
        ],
      },
      payment: {
        create: {
          amount: new Decimal(41000),
          method: "TRANSFER",
          status: "PAID",
          paidAt: new Date(now.getTime() - 30 * 60 * 1000),
        },
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2024-003",
      customerId: customers[2].id,
      status: "PROCESSED",
      deliveryMethod: "DIANTAR",
      address: "Jl. Ahmad Yani No. 78, Tasikmalaya",
      subtotal: new Decimal(50000),
      deliveryFee: new Decimal(5000),
      discount: new Decimal(0),
      totalPrice: new Decimal(55000),
      items: {
        create: [
          {
            menuId: menus[3].id,
            quantity: 2,
            price: new Decimal(22000),
            subtotal: new Decimal(44000),
          },
          {
            menuId: menus[7].id,
            quantity: 1,
            price: new Decimal(8000),
            subtotal: new Decimal(8000),
          },
        ],
      },
      payment: {
        create: {
          amount: new Decimal(55000),
          method: "QRIS",
          status: "PAID",
          paidAt: new Date(now.getTime() - 15 * 60 * 1000),
        },
      },
    },
  });

  const order4 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2024-004",
      customerId: customers[3].id,
      status: "READY",
      deliveryMethod: "AMBIL_SENDIRI",
      address: "Warung Enin, Taraju",
      subtotal: new Decimal(28000),
      deliveryFee: new Decimal(0),
      discount: new Decimal(0),
      totalPrice: new Decimal(28000),
      items: {
        create: [
          {
            menuId: menus[5].id,
            quantity: 1,
            price: new Decimal(28000),
            subtotal: new Decimal(28000),
          },
        ],
      },
      payment: {
        create: {
          amount: new Decimal(28000),
          method: "CASH",
          status: "PAID",
          paidAt: new Date(now.getTime() - 10 * 60 * 1000),
        },
      },
    },
  });

  // Create Reviews
  console.log("Creating reviews...");
  await Promise.all([
    prisma.review.create({
      data: {
        menuId: menus[0].id,
        userId: customers[0].id,
        orderId: order1.id,
        rating: 5,
        comment: "Enak banget! Sambelnya mantap dan pedasnya pas!",
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        menuId: menus[1].id,
        userId: customers[0].id,
        orderId: order1.id,
        rating: 5,
        comment: "Baksonya besar-besar, kuahnya seger! Recommended!",
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        menuId: menus[2].id,
        userId: customers[1].id,
        orderId: order2.id,
        rating: 4,
        comment: "Sotonya enak, bumbunya meresap. Porsi agak kurang banyak.",
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        menuId: menus[3].id,
        userId: customers[2].id,
        orderId: order3.id,
        rating: 5,
        comment: "Nasi gorengnya top! Naga-naganya enak, porsi juga banyak!",
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        menuId: menus[5].id,
        userId: customers[3].id,
        orderId: order4.id,
        rating: 5,
        comment: "Ayam bakarnya juara! Bumbu madunya berasa banget.",
        isVerified: true,
      },
    }),
  ]);

  // Create Favorites
  console.log("Creating favorites...");
  await Promise.all([
    prisma.favorite.create({
      data: {
        userId: customers[0].id,
        menuId: menus[0].id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: customers[0].id,
        menuId: menus[1].id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: customers[0].id,
        menuId: menus[5].id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: customers[1].id,
        menuId: menus[2].id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: customers[2].id,
        menuId: menus[3].id,
      },
    }),
  ]);

  // Create Notifications
  console.log("Creating notifications...");
  await Promise.all([
    // Admin notifications
    prisma.notification.create({
      data: {
        type: "NEW_ORDER",
        title: "Pesanan Baru! 🎉",
        message: `${customers[2].name} membuat pesanan baru #ORD-2024-003`,
        isRead: false,
        data: { orderId: order3.id, orderNumber: "ORD-2024-003" },
      },
    }),
    prisma.notification.create({
      data: {
        type: "NEW_ORDER",
        title: "Pesanan Baru! 🎉",
        message: `${customers[3].name} membuat pesanan baru #ORD-2024-004`,
        isRead: false,
        data: { orderId: order4.id, orderNumber: "ORD-2024-004" },
      },
    }),
    prisma.notification.create({
      data: {
        type: "SYSTEM",
        title: "Stok Menu Menipis ⚠️",
        message: "Stok Ayam Bakar Madu tinggal 25 porsi",
        isRead: true,
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      },
    }),
    // Customer notifications
    prisma.notification.create({
      data: {
        userId: customers[0].id,
        type: "ORDER_STATUS",
        title: "Status Pesanan #ORD-2024-001",
        message: "Pesanan Anda telah selesai",
        isRead: true,
        data: {
          orderId: order1.id,
          orderNumber: "ORD-2024-001",
          status: "COMPLETED",
        },
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customers[0].id,
        type: "PAYMENT_SUCCESS",
        title: "Pembayaran Berhasil ✅",
        message:
          "Pembayaran pesanan #ORD-2024-001 sebesar Rp 48.000 telah dikonfirmasi",
        isRead: true,
        data: {
          orderId: order1.id,
          orderNumber: "ORD-2024-001",
          amount: 48000,
        },
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customers[1].id,
        type: "ORDER_STATUS",
        title: "Status Pesanan #ORD-2024-002",
        message: "Pesanan Anda sedang dikirim oleh kurir",
        isRead: false,
        data: {
          orderId: order2.id,
          orderNumber: "ORD-2024-002",
          status: "ON_DELIVERY",
        },
        createdAt: new Date(now.getTime() - 20 * 60 * 1000),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customers[2].id,
        type: "ORDER_STATUS",
        title: "Status Pesanan #ORD-2024-003",
        message: "Pesanan Anda sedang diproses",
        isRead: false,
        data: {
          orderId: order3.id,
          orderNumber: "ORD-2024-003",
          status: "PROCESSED",
        },
        createdAt: new Date(now.getTime() - 15 * 60 * 1000),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customers[3].id,
        type: "ORDER_STATUS",
        title: "Status Pesanan #ORD-2024-004",
        message: "Pesanan Anda sudah siap diambil!",
        isRead: false,
        data: {
          orderId: order4.id,
          orderNumber: "ORD-2024-004",
          status: "READY",
        },
        createdAt: new Date(now.getTime() - 10 * 60 * 1000),
      },
    }),
    // Promo notifications
    prisma.notification.create({
      data: {
        type: "PROMO",
        title: "Promo Spesial! 🎁",
        message: "Gunakan kode DISKON50 untuk diskon 50%, maksimal Rp 25.000!",
        isRead: false,
        data: { promoCode: "DISKON50" },
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customers[0].id,
        type: "PROMO",
        title: "Gratis Ongkir! 🚚",
        message: "Pakai kode GRATISONGKIR untuk gratis ongkir hari ini!",
        isRead: false,
        data: { promoCode: "GRATISONGKIR" },
        createdAt: new Date(now.getTime() - 45 * 60 * 1000),
      },
    }),
  ]);

  // Update Settings
  console.log("Updating settings...");
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {
      storeName: "Warung Enin",
      storeAddress: "Taraju, Kabupaten Tasikmalaya, Jawa Barat",
      storePhone: "081234567890",
      storeEmail: "info@warungenin.com",
      deliveryRadius: 5,
      deliveryFee: 5000,
      minOrder: 15000,
      taxPercentage: 0,
      serviceCharge: 0,
      whatsappNumber: "6281234567890",
      whatsappEnabled: true,
      isOpen: true,
      openingHour: "08:00",
      closingHour: "21:00",
      gmapsUrl: "https://maps.google.com/?q=Tasikmalaya",
      instagramUrl: "https://instagram.com/warungenin",
      facebookUrl: "https://facebook.com/warungenin",
    },
    create: {
      id: "default",
      storeName: "Warung Enin",
      storeAddress: "Taraju, Kabupaten Tasikmalaya, Jawa Barat",
      storePhone: "081234567890",
      storeEmail: "info@warungenin.com",
      deliveryRadius: 5,
      deliveryFee: 5000,
      minOrder: 15000,
      taxPercentage: 0,
      serviceCharge: 0,
      whatsappNumber: "6281234567890",
      whatsappEnabled: true,
      isOpen: true,
      openingHour: "08:00",
      closingHour: "21:00",
      gmapsUrl: "https://maps.google.com/?q=Tasikmalaya",
      instagramUrl: "https://instagram.com/warungenin",
      facebookUrl: "https://facebook.com/warungenin",
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log("- 2 Admin users (main + test)");
  console.log("- 5 Customer users (4 regular + 1 test member)");
  console.log("- 1 Courier user (test)");
  console.log("- 3 Couriers (delivery)");
  console.log("- 10 Menu items (with realistic prices & images)");
  console.log("- 5 Active promos");
  console.log("- 3 Customer addresses");
  console.log("- 4 Orders (COMPLETED, ON_DELIVERY, PROCESSED, READY)");
  console.log("- 5 Reviews (all verified)");
  console.log("- 5 Favorites");
  console.log("- 10 Notifications (admin & customer)");
  console.log("- Settings configured");
  console.log("\n🔑 Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin (Main):  admin@warungenin.com  / admin123");
  console.log("Admin (Test):  admin@warung.com      / admin123");
  console.log("Member (Test): member@test.com       / password123");
  console.log("Courier:       kurir@warung.com      / kurir123");
  console.log("Customer:      budi@example.com      / customer123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
