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
        message: "Get single student successful",
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
