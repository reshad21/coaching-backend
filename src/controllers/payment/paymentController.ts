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

export const getSingleStudentPaymentControllerById = catchAsync(async (req, res) => {
    const { id } = req?.params;

    const result = await prisma.student.findFirst({
        where: {
            id,
        },
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get single student successful",
        data: result,
    });
});

// export const deleteStudentController = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   // Check if the student exists
//   const existingStudent = await prisma.student.findUnique({
//     where: { id },
//   });

//   if (!existingStudent) {
//     return sendResponse(res, {
//       statusCode: 404,
//       success: false,
//       message: "student not found",
//     });
//   }

//   // Delete the student
//   const result = await prisma.student.delete({
//     where: { id },
//   });

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "student deleted successfully",
//     data: result,
//   });
// });

// export const updateStudentController = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   // Check if the vacation exists
//   const existingStudent = await prisma.student.findUnique({
//     where: { id },
//   });

//   if (!existingStudent) {
//     return sendResponse(res, {
//       statusCode: 404,
//       success: false,
//       message: "student not found",
//     });
//   }

//   // Update vacation with partial data
//   const updatedStudent = await prisma.student.update({
//     where: { id },
//     data: updateData,
//   });

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "student updated successfully",
//     data: updatedStudent,
//   });
// });
