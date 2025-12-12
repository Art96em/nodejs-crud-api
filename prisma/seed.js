import bcrypt from "bcrypt";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding DB...");

  await prisma.users.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      first_name: "Admin",
      last_name: "Admin",
      email: "admin@example.com",
      password_hash: await bcrypt.hash("admin1234", 10),
      role: "admin",
    },
  });

  const products = [
    {
      name: "Apple iPhone 15",
      description: "Newest generation iPhone with A17 chip",
      price: Decimal(3999.99),
      quantity: 50,
      image_url: "https://example.com/iphone15.jpg",
    },
    {
      name: "Samsung Galaxy S24",
      description: "Flagship Samsung smartphone",
      price: Decimal(3499.99),
      quantity: 40,
      image_url: "https://example.com/galaxy-s24.jpg",
    },
    {
      name: "Sony WH-1000XM5",
      description: "Noise-cancelling wireless headphones",
      price: Decimal(1599.0),
      quantity: 100,
      image_url: "https://example.com/sony-wh1000xm5.jpg",
    },
    {
      name: "Nintendo Switch OLED",
      description: "OLED edition handheld console",
      price: Decimal(1590.0),
      quantity: 30,
      image_url: "https://example.com/switch-oled.jpg",
    },
    {
      name: "Apple MacBook Pro 14 M3",
      description: "Laptop with M3 processor",
      price: Decimal(8999.99),
      quantity: 15,
      image_url: "https://example.com/mbp14-m3.jpg",
    },
    {
      name: "Logitech MX Master 3S",
      description: "Wireless ergonomic mouse",
      price: Decimal(349.99),
      quantity: 200,
      image_url: "https://example.com/mx-master-3s.jpg",
    },
    {
      name: "Kindle Paperwhite 2023",
      description: "E-reader with backlight and waterproofing",
      price: Decimal(499.99),
      quantity: 70,
      image_url: "https://example.com/kindle-paperwhite.jpg",
    },
  ];

  // Добавляем товары
  for (const p of products) {
    await prisma.products.create({
      data: p,
    });
  }
}

main()
  .then(() => {
    console.log("Seeding complete.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
