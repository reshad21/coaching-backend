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

  if (!month) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Month is required.",
    });
  }

  // Safely parse inputs
  const salary = Number(instructorSalary) || 0;
  const materials = Number(materialCost) || 0;
  const rent = Number(rentAndUtilities) || 0;
  const marketing = Number(marketingCost) || 0;
  const others = Number(otherExpenses) || 0;

  const newCost = salary + materials + rent + marketing + others;

  // Total revenue
  const studentFees = await prisma.student.aggregate({
    _sum: { admissionFees: true },
  });
  const totalAdmissionFees = Number(studentFees._sum.admissionFees) || 0;

  const payments = await prisma.payment.aggregate({
    _sum: { amount: true },
  });
  const totalPayments = Number(payments._sum.amount) || 0;

  const totalRevenue = totalAdmissionFees + totalPayments;

  // Check for existing month record
  const existingCost = await prisma.coachingCost.findFirst({
    where: { month },
  });

  let result;

  if (existingCost) {
    // Use null-safe fallback (?? 0)
    const updatedInstructorSalary =
      (existingCost.instructorSalary ?? 0) + salary;
    const updatedMaterialCost = (existingCost.materialCost ?? 0) + materials;
    const updatedRentAndUtilities =
      (existingCost.rentAndUtilities ?? 0) + rent;
    const updatedMarketingCost =
      (existingCost.marketingCost ?? 0) + marketing;
    const updatedOtherExpenses = (existingCost.otherExpenses ?? 0) + others;

    const updatedTotalCost =
      updatedInstructorSalary +
      updatedMaterialCost +
      updatedRentAndUtilities +
      updatedMarketingCost +
      updatedOtherExpenses;

    const updatedProfit = totalRevenue - updatedTotalCost;

    result = await prisma.coachingCost.update({
      where: { id: existingCost.id },
      data: {
        instructorSalary: updatedInstructorSalary,
        materialCost: updatedMaterialCost,
        rentAndUtilities: updatedRentAndUtilities,
        marketingCost: updatedMarketingCost,
        otherExpenses: updatedOtherExpenses,
        totalCost: updatedTotalCost,
        totalRevenue,
        profit: updatedProfit,
      },
    });
  } else {
    const profit = totalRevenue - newCost;

    result = await prisma.coachingCost.create({
      data: {
        month,
        instructorSalary: salary,
        materialCost: materials,
        rentAndUtilities: rent,
        marketingCost: marketing,
        otherExpenses: others,
        totalCost: newCost,
        totalRevenue,
        profit,
      },
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: existingCost
      ? "Academic cost updated by adding new values."
      : "Academic cost created successfully.",
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
