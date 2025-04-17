import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import AppError from "@/errors/AppError";
import { generateToken } from "@/utils/jwt";

export const loginController = catchAsync(async (req, res) => {
  const data = req.body;
    
  if (!data?.email) {
    throw new AppError(400, "please provide your email");
  }
  if (!data?.password) {
    throw new AppError(400, "please provide your password");
  }
    
  const admin = await prisma.admin.findFirst({
    where: {
      email: data?.email,
    },
  });
  console.log(admin);
  
  if (!admin) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email!!",
    });
  }
  
  
  if (admin?.password != data?.password) {
    throw new AppError(400, "wrong password");
  }
  const adminEmail = admin?.email;
  const adminName = admin?.name;
  const adminPhone = admin?.phone;
  const adminId = admin?.id;
  const jwtPayload = {
    email: adminEmail,
    id: adminId,
    phone: adminPhone,
    name: adminName,
  };

  const token = generateToken(jwtPayload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login Successfully",
    data: { token },
  });
});
