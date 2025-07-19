import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import AppError from "@/errors/AppError";
import { generateToken } from "@/utils/jwt";
import bcryptjs from 'bcryptjs'

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
  
  if (!admin) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email!!",
    });
  }
  const isPasswordMatch = bcryptjs.compareSync(
    data.password,
    admin?.password,
  );
  
  if (!isPasswordMatch) {
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
