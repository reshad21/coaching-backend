import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

// Auth middleware with dynamic feature check
const auth = (requiredFeature: Record<string, number[]>) => {
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

    const userExists = await prisma.adminUser.findUnique({
      where: {
        email: email,
      },
      include: {
        Role: {
          include: {
            feature: true,
          },
        },
      },
    });

    const features = userExists?.Role?.feature;
    const transformedFeature: Record<string, number[]> = {};

    features?.forEach(({ name }) => {
      const [category, number] = name.split("-");
      if (!transformedFeature[category]) {
        transformedFeature[category] = [];
      }
      transformedFeature[category].push(Number(number));
    });

    // logconsole.("Transformed Feature:", transformedFeature);
    // console.log("Required Feature:", requiredFeature);

    // Check if the required feature matches any feature in transformedFeature
    let isMatch = false;

    // Loop through each key in requiredFeature
    for (const key in requiredFeature) {
      if (transformedFeature[key]) {
        // Loop through numbers in requiredFeature for the current category
        for (let num of requiredFeature[key]) {
          if (!transformedFeature[key].includes(num)) {
            isMatch = false;
            break;
          }
          isMatch = true;
        }
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "You are not authorized to access this route",
      });
    }
    (req as Request & { user: JwtPayload }).user = decoded as JwtPayload;
    // req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;

