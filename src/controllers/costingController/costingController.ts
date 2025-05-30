import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { QueryBuilder } from "@/builders/builders";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";


export const CreateAcademicCostController = catchAsync(async (req, res) => {
  const {
    instructorSalary,
    materialCost,
    rentAndUtilities,
    marketingCost,
    otherExpenses = 0,
  } = req.body;

  // Step 1: Calculate total cost
  const totalCost =
    instructorSalary +
    materialCost +
    rentAndUtilities +
    marketingCost +
    otherExpenses;

  // Step 2: Count students
  const numberOfStudents = await prisma.student.count();

  // Step 3: Sum admissionFees from Student model
  const studentFees = await prisma.student.aggregate({
    _sum: {
      admissionFees: true,
    },
  });
  const totalAdmissionFees = studentFees._sum.admissionFees || 0;

  // Step 4: Sum payments from Payment model
  const payments = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });
  const totalPayments = payments._sum.amount || 0;

  // Step 5: Calculate total revenue and profit
  const totalRevenue = totalAdmissionFees + totalPayments;
  const profit = totalRevenue - totalCost;

  // Step 6: Save academic cost data
  const result = await prisma.coachingCost.create({
    data: {
      instructorSalary,
      materialCost,
      rentAndUtilities,
      marketingCost,
      otherExpenses,
      totalCost,
      totalRevenue,
      profit,
    },
  });

  // Step 7: Send response
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Academic cost calculated and saved successfully",
    data: result,
  });
});




export const getAllAcademicCostController = catchAsync(async (req, res) => {
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

export const getAcademicCostControllerById = catchAsync(async (req, res) => {
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
        message: "Get single student successful",
        data: result,
    });
});

export const updateAcademicCostController = catchAsync(async (req, res) => {
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
