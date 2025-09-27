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

// Total income by different periods
export const getTotalIncomeController = catchAsync(async (req, res) => {
  const now = new Date();

  const getTotal = async (start: Date, end: Date) =>
    (await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: start, lt: end } },
    }))?._sum?.amount || 0;

  // Daily
  const dailyTotal = await getTotal(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  );

  // Weekly
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  const weeklyTotal = await getTotal(weekStart, weekEnd);

  // Monthly
  const monthlyTotal = await getTotal(
    new Date(now.getFullYear(), now.getMonth(), 1),
    new Date(now.getFullYear(), now.getMonth() + 1, 1)
  );

  // Yearly
  const yearlyTotal = await getTotal(
    new Date(now.getFullYear(), 0, 1),
    new Date(now.getFullYear() + 1, 0, 1)
  );

  // Custom range
  const fromStr = req.query.from as string;
  const toStr = req.query.to as string;

  let customTotal = 0;

  if (fromStr && toStr) {
    const from = new Date(fromStr);
    const to = new Date(toStr);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid date format for custom range",
        data: null,
      });
    }

    // Include full end day
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    customTotal = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: from, lte: to } },
    }).then(r => r._sum.amount || 0);
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: fromStr && toStr ? "Fetched total income by custom period" : "Fetched total income by period",
    data: {
      daily: dailyTotal,
      weekly: weeklyTotal,
      monthly: monthlyTotal,
      yearly: yearlyTotal,
      custom: customTotal,
    },
  });
});






