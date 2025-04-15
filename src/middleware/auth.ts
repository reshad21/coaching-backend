import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

// Auth middleware with dynamic feature check
const auth = () => {
  return catchAsync(async (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "You are not authorized to access this route",
      });
    }

    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, "your_secret_key") as JwtPayload;

    const { email} = decoded;

    const userExists = await prisma.admin.findFirst({
      where: {
        email: email,
      }
    });

   
    if (!userExists) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "You are not authorized to access this route",
      });
    }
    (req as Request & { user: JwtPayload }).user = decoded as JwtPayload;
    
    next();
  });
};

export default auth;

