import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { QueryBuilder } from "@/builders/builders";

export const createStudentController = catchAsync(async (req, res) => {
  // const { studentName } = req?.body;
  const data = req.body;

  const findStudent = await prisma.student.findFirst({
    where: {
      // firstName:data.firstName,
      // dateOfBirth: data.dateOfBirth
      studentId: data.studentId,
    },
  });
  if (findStudent) {
    return res.status(400).json({
      success: false,
      message: "student already exists !!",
    });
  }

  const result = await prisma.student.create({
    data,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "student Create Successfully",
    data: result,
  });
});

export const getAllStudentController = catchAsync(async (req, res) => {
  // const result = await prisma.student.findMany();

  const result = await new QueryBuilder("student", req.query)
    .search(["firstName", "lastName"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all student Successfully",
    data: result,
  });
});

export const getStudentControllerById = catchAsync(async (req, res) => {
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

export const deleteStudentController = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if the student exists
  const existingStudent = await prisma.student.findUnique({
    where: { id },
  });

  if (!existingStudent) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "student not found",
    });
  }

  // Delete the student
  const result = await prisma.student.delete({
    where: { id },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "student deleted successfully",
    data: result,
  });
});

export const updateStudentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if the vacation exists
  const existingStudent = await prisma.student.findUnique({
    where: { id },
  });

  if (!existingStudent) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "student not found",
    });
  }

  // Update vacation with partial data
  const updatedStudent = await prisma.student.update({
    where: { id },
    data: updateData,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "student updated successfully",
    data: updatedStudent,
  });
});
