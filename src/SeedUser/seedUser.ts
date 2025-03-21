import { PrismaClient } from "@prisma/client";
import { role } from "./const";
import { createAdminUser } from "./createAdmin";
const prisma: PrismaClient = new PrismaClient();



export const seedAdminUser = async () => {
  const isRoleExists = await prisma.role.findFirst({
    where: {
      id: role?.id,
    },
  });

  if (!isRoleExists) {
    await prisma.role.create({
      data: {
        id: role?.id,
        name: role?.name,
        feature: {
          create: role?.feature?.map((data: any) => ({
            name: data?.name,
          })),
        },
      },
      include: {
        feature: true,
        adminUser: true,
      },
    });
    
  }
  createAdminUser(role?.id)
};

