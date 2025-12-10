import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const adminUsers = [
  {
    name: "Super Admin",
    email: "coaching.managment@gmail.com",
    phone: "01700000001",
    password: "Admin@123",
  },
  {
    name: "Second Admin",
    email: "admin2@gmail.com",
    phone: "01700000002",
    password: "Admin@123",
  },
];

export const seedUser = async () => {
  for (const admin of adminUsers) {
    const isExists = await prisma.admin.findUnique({
      where: {
        email: admin.email,   // ✅ email check
      },
    });

    if (!isExists) {
      const hashPassword = await bcryptjs.hash(admin.password, 10);

      await prisma.admin.create({
        data: {
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          password: hashPassword,
        },
      });

      console.log(`✅ Admin Seeded: ${admin.email}`);
    } else {
      console.log(`⚠️ Already Exists: ${admin.email}`);
    }
  }
};
