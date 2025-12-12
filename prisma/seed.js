import bcrypt from "bcrypt";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
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
