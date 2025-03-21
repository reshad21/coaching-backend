import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";

export const createBatchController = catchAsync(async (req, res) => {
  const body = req?.body;
  const result = await prisma.class.create({
    data: body,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Batch Create Successfully",
    data: result,
  });
});
