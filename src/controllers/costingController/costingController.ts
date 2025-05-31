import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { QueryBuilder } from "@/builders/builders";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";



export const CreateAcademicCostController = catchAsync(async (req, res) => {
  const {
    month,
    instructorSalary,
    materialCost,
    rentAndUtilities,
    marketingCost,
    otherExpenses = 0,
  } = req.body;

  // Validate month
  if (!month) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Month is required.",
    });
  }

  // Step 1: Safely parse all cost values
  const salary = Number(instructorSalary) || 0;
  const materials = Number(materialCost) || 0;
  const rent = Number(rentAndUtilities) || 0;
  const marketing = Number(marketingCost) || 0;
  const others = Number(otherExpenses) || 0;

  // Step 2: Calculate total cost
  const totalCost = salary + materials + rent + marketing + others;

  // Step 3: Count students (if needed in the future)
  const numberOfStudents = await prisma.student.count();

  // Step 4: Sum admissionFees from Student model
  const studentFees = await prisma.student.aggregate({
    _sum: {
      admissionFees: true,
    },
  });
  const totalAdmissionFees = Number(studentFees._sum.admissionFees) || 0;

  // Step 5: Sum payments from Payment model
  const payments = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });
  const totalPayments = Number(payments._sum.amount) || 0;

  // Step 6: Calculate total revenue and profit
  const totalRevenue = totalAdmissionFees + totalPayments;
  const profit = totalRevenue - totalCost;

  // Step 7: Check for existing cost record for the month
  const existingCost = await prisma.coachingCost.findFirst({
    where: { month },
  });

  let result;

  if (existingCost) {
    // Update existing cost record
    result = await prisma.coachingCost.update({
      where: { id: existingCost.id },
      data: {
        instructorSalary: salary,
        materialCost: materials,
        rentAndUtilities: rent,
        marketingCost: marketing,
        otherExpenses: others,
        totalCost,
        totalRevenue,
        profit,
      },
    });
  } else {
    // Create new cost record
    result = await prisma.coachingCost.create({
      data: {
        month,
        instructorSalary: salary,
        materialCost: materials,
        rentAndUtilities: rent,
        marketingCost: marketing,
        otherExpenses: others,
        totalCost,
        totalRevenue,
        profit,
      },
    });
  }

  // Step 8: Send response
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: existingCost
      ? "Academic cost updated successfully"
      : "Academic cost created successfully",
    data: result,
  });
});








export const getAllAcademicCostController = catchAsync(async (req, res) => {
  // const result = await prisma.student.findMany();

  const result = await new QueryBuilder("coachingCost", req.query)
    .search(["instructorSalary", "month", "materialCost", "rentAndUtilities", "marketingCost", "otherExpenses"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .include()
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

  const result = await prisma.coachingCost.findFirst({
    where: {
      id,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get single cost successful",
    data: result,
  });
});

export const updateAcademicCostController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if the payment exists
  const existingPayment = await prisma.coachingCost.findUnique({
    where: { id },
  });

  if (!existingPayment) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Cost not found",
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
    message: "Costing updated successfully",
    data: updatedPayment,
  });
});
