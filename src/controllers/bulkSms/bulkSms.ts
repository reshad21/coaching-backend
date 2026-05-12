import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();
import AppError from "../../errors/AppError";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const sendSmsRequest = async (phoneNumbers: string, message: string) => {
  const apiKey = process.env.API_KEY;
  const senderId = process.env.SENDER_ID;

  console.log("[SMS] Sending request:", {
    phoneNumbers,
    hasApiKey: !!apiKey,
    hasSenderId: !!senderId,
  });

  if (!apiKey || !senderId) {
    const errMsg = `SMS service not configured: API_KEY=${!!apiKey}, SENDER_ID=${!!senderId}`;
    console.error("[SMS]", errMsg);
    throw new AppError(500, errMsg);
  }

  const url = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${encodeURIComponent(phoneNumbers)}&senderid=${senderId}&message=${encodeURIComponent(message)}`;

  console.log("[SMS] Request URL:", url.replace(apiKey, "***"));

  try {
    const result = await fetch(url, {
      method: "GET",
    });

    const rawBody = await result.text();
    console.log("[SMS] Response status:", result.status, "body:", rawBody);

    if (!result.ok) {
      const errorMsg = `SMS provider error: ${result.status} - ${rawBody}`;
      console.error("[SMS]", errorMsg);
      throw new AppError(
        result.status,
        rawBody || "SMS provider request failed",
      );
    }

    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  } catch (error) {
    console.error("[SMS] Fetch error:", error);
    throw error;
  }
};

export const bulkController = catchAsync(async (req, res) => {
  const { message } = req.body;
  const phoneNumbers = "01600416187";

  const data = await sendSmsRequest(phoneNumbers, message);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Class Create Successfully",
    data: data,
  });
});
export const batchBulkMsgController = catchAsync(async (req, res) => {
  const { message, id } = req.body;

  const response = await prisma.batch.findFirst({
    where: {
      id,
    },
    include: {
      students: {
        select: {
          phone: true,
        },
      },
    },
  });
  const phoneNumbers = response?.students?.map((s) => s.phone).join(",");
  if (!phoneNumbers) {
    throw new AppError(404, "No students found for this class or batch");
  }
  const data = await sendSmsRequest(phoneNumbers, message);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Send Message Successfully",
    data: data,
  });
});
export const allStudentBulkMsgController = catchAsync(async (req, res) => {
  const { message } = req.body;

  const response = await prisma.student.findMany();
  const phoneNumbers = response?.map((s) => s.phone).join(",");
  if (!phoneNumbers) {
    throw new AppError(404, "No students found");
  }
  const data = await sendSmsRequest(phoneNumbers, message);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Send Message Successfully",
    data: phoneNumbers,
  });
});
export const classBulkMsgController = catchAsync(async (req, res) => {
  const { message, classId } = req.body;
  const response = await prisma.class.findFirst({
    where: {
      id: classId,
    },
    include: {
      Student: {
        select: {
          phone: true,
        },
      },
    },
  });
  const phoneNumbers = response?.Student?.map((s) => s.phone).join(",");

  if (!phoneNumbers) {
    throw new AppError(404, "No students found for this class or batch");
  }
  const data = await sendSmsRequest(phoneNumbers, message);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Send Message Successfully",
    data: data,
  });
});
export const shiftBulkMsgController = catchAsync(async (req, res) => {
  const { message, shiftId } = req.body;
  const response = await prisma.shift.findFirst({
    where: {
      id: shiftId,
    },
    include: {
      Student: {
        select: {
          phone: true,
        },
      },
    },
  });
  const phoneNumbers = response?.Student?.map((s) => s.phone).join(",");

  if (!phoneNumbers) {
    throw new AppError(404, "No students found for this class or batch");
  }
  const data = await sendSmsRequest(phoneNumbers, message);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Send Message Successfully",
    data: data,
  });
});
export const singleMessageMsgController = catchAsync(async (req, res) => {
  const { message, number } = req.body;

  if (!number) {
    throw new AppError(400, "Phone number is required");
  }
  const data = await sendSmsRequest(number, message);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Send Message Successfully",
    data: data,
  });
});
