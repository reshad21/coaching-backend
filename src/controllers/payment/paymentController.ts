import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { QueryBuilder } from "@/builders/builders";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";

export const paymentStudentController = catchAsync(async (req, res) => {
    const amount = Number(req.body.amount);

    const newStudent = await prisma.payment.create({
        data: {
            amount,
            ...req.body,
        },
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment created successfully",
        data: newStudent,
    });
});


export const getAllStudentPaymentController = catchAsync(async (req, res) => {
    // const result = await prisma.student.findMany();

    const result = await new QueryBuilder("payment", req.query)
        .search(["title", "month", "amount"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .include({
            Student: true
        })
        .execute();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get all payment status",
        meta: result?.meta,
        data: result?.data ? result?.data : result,
    });
});


export const getSingleStudentPaymentControllerById = catchAsync(async (req, res) => {
    const { id } = req?.params;

    const result = await prisma.student.findFirst({
        where: {
            id,
        },
        include: {
            Payment: true,
        }
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get single student payment data successful",
        data: result,
    });
});

export const updateStudentPaymentController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Check if the payment exists
    const existingPayment = await prisma.payment.findUnique({
        where: { id },
    });

    if (!existingPayment) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Payment not found",
        });
    }

    // Update payment with partial data
    const updatedPayment = await prisma.payment.update({
        where: { id },
        data: updateData,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment updated successfully",
        data: updatedPayment,
    });
});


export const getTotalIncomeController = catchAsync(async (req, res) => {
  const now = new Date();

  // Daily total
  const dailyTotal = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      },
    },
  });

  // Weekly total
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7); // Next Sunday

  const weeklyTotal = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      createdAt: {
        gte: weekStart,
        lt: weekEnd,
      },
    },
  });

  // Monthly total
  const monthlyTotal = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      },
    },
  });

  // Yearly total
  const yearlyTotal = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      createdAt: {
        gte: new Date(now.getFullYear(), 0, 1),
        lt: new Date(now.getFullYear() + 1, 0, 1),
      },
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Fetched total income by period",
    data: {
      daily: dailyTotal._sum.amount || 0,
      weekly: weeklyTotal._sum.amount || 0,
      monthly: monthlyTotal._sum.amount || 0,
      yearly: yearlyTotal._sum.amount || 0,
    },
  });
});



