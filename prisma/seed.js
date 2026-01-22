// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// أنشئ PrismaClient جديد بدون الاعتماد على globalThis في seed
const prisma = new PrismaClient();

async function main() {
  // كلمة المرور من env أو افتراضية
  const password = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "shehta60607",
    10,
  );

  await prisma.appUsers.upsert({
    where: { email: "admin@shehta.com" },
    update: {},
    create: {
      email: "admin@shehta.com",
      password,
      role: "superadmin",
    },
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
