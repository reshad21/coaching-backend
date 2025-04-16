import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
const prisma: PrismaClient = new PrismaClient();

export const seedUser = async () => {
    const isRoleExists = await prisma.admin.findFirst({
      where: {
        id: "admin4171-b47cl-h4db-ma6eo-kd-2b9922b4",
      },
    });
  
    if (!isRoleExists) {
      
    const password = await bcryptjs.hash("coaching.managment@gmail.com", 10);
      await prisma.admin.create({
        data: {
          id: "admin4171-b47cl-h4db-ma6eo-kd-2b9922b4",
          name: "Supper Admin",
          email:"coaching.managment@gmail.com",
          password:password,
          phone:"017"
        }
      });
      console.log("admin is created");
      
    }
  };