import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
const prisma: PrismaClient = new PrismaClient();

export const createAdminUser = async (roleId: string) => {
  const adminUser = {
    firstName: "System",
    lastName: "Admin",
    phoneNumber: "N/A",
    address: "N/A",
    image: "N/A",
    email: "system@gmail.com",
    password: "system@gmail.com",
    roleId,
  };
  const isAdminUserExists = await prisma.adminUser.findFirst({
    where: {
      email: "system@gmail.com",
    },
  });

  if (!isAdminUserExists) {
    adminUser.password = await bcryptjs.hash(adminUser.password, 10);
    await prisma.adminUser.create({
      data: adminUser,
    });
    console.log("seed admin user create successful");
    
  }
};
