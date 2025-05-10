import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
dotenv.config();
import AppError from "@/errors/AppError";

export const bulkController = catchAsync(async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.API_KEY;
  const senderId = process.env.SENDER_ID;

  //   const users = await prisma.user.findMany({
  //     select: { phone: true },
  //   });

  //   const phoneNumbers = users.map((user) => `880${user.phone}`).join(',');
  const phoneNumbers = "01600416187";
  // const message = "Hello Sabilar Bhai,This is testing for Bulk Message"

  const url = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${encodeURIComponent(phoneNumbers)}&senderid=${senderId}&message=${encodeURIComponent(message)}`;

  const result = await fetch(url, {
    method: "GET",
  });

  if (!result.ok) {
    throw new AppError(500, "Failed to send Bulk SMS");
  }
  const data = await result.json();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Class Create Successfully",
    data: data,
  });
});
export const batchBulkMsgController = catchAsync(async (req, res) => {
  const { message,id } = req.body;
  const apiKey = process.env.API_KEY;
  const senderId = process.env.SENDER_ID;

  const response = await prisma.batch.findFirst({
    where: {
      id ,
    },
    include:{
     students:{
      select:{
        phone:true
      }
     }
    }
  });
  const phoneNumbers = response?.students?.map(s => s.phone).join(',');
  if (!phoneNumbers) {
    throw new AppError(404,"No students found for this class or batch")
  }
  const url = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${encodeURIComponent(phoneNumbers)}&senderid=${senderId}&message=${encodeURIComponent(message)}`;

  const result = await fetch(url, {
    method: "GET",
  });

  if (!result.ok) {
    throw new AppError(500, "Failed to send Bulk SMS");
  }
  const data = await result.json();
 
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Send Message Successfully",
    data: data, 
  });
});
export const classBulkMsgController = catchAsync(async (req, res) => {
  const { message,classId } = req.body;
  const apiKey = process.env.API_KEY;
  const senderId = process.env.SENDER_ID;
  const response = await prisma.class.findFirst({
    where: {
      id:classId ,
    },
    include:{
     Student:{
      select:{
        phone:true,
      }
     }
    }
  });
  const phoneNumbers = response?.Student?.map(s => s.phone).join(',');
  
  if (!phoneNumbers) {
    throw new AppError(404,"No students found for this class or batch")
  }
  const url = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${encodeURIComponent(phoneNumbers)}&senderid=${senderId}&message=${encodeURIComponent(message)}`;

  const result = await fetch(url, {
    method: "GET",
  });

  if (!result.ok) {
    throw new AppError(500, "Failed to send Bulk SMS");
  }
  const data = await result.json();
 
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Send Message Successfully",
    data: data, 
  });
});
export const shiftBulkMsgController = catchAsync(async (req, res) => {
  const { message,shiftId } = req.body;
  const apiKey = process.env.API_KEY;
  const senderId = process.env.SENDER_ID;
  const response = await prisma.shift.findFirst({
    where: {
      id:shiftId ,
    },
    include:{
     Student:{
      select:{
        phone:true,
      }
     }
    }
  });
  const phoneNumbers = response?.Student?.map(s => s.phone).join(',');

 
  if (!phoneNumbers) {
    throw new AppError(404,"No students found for this class or batch")
  }
  const url = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${encodeURIComponent(phoneNumbers)}&senderid=${senderId}&message=${encodeURIComponent(message)}`;

  const result = await fetch(url, {
    method: "GET",
  });
  if (!result.ok) {
    throw new AppError(500, "Failed to send Bulk SMS");
  }
  const data = await result.json();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Send Message Successfully",
    data: data, 
  });
});
export const singleMessageMsgController = catchAsync(async (req, res) => {
  const { message,number} = req.body;
  const apiKey = process.env.API_KEY;
  const senderId = process.env.SENDER_ID;

  
  if (!number) {
    throw new AppError(404,"No students found for this class or batch")
  }
  const url = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${encodeURIComponent(number)}&senderid=${senderId}&message=${encodeURIComponent(message)}`;

  const result = await fetch(url, {
    method: "GET",
  });

  if (!result.ok) {
    throw new AppError(500, "Failed to send SMS");
  }
  const data = await result.json();
 
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Send Message Successfully",
    data: data, 
  });
});