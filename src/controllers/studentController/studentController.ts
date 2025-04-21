import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { QueryBuilder } from "@/builders/builders";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";


export const createStudentController = catchAsync(async (req, res) => {
  const { firstName, lastName, phone, dateOfBirth } = req.body;

  // Generate Student ID (e.g., COACH-202503-0001)
  const currentYearMonth = new Date().toISOString().slice(0, 7).replace("-", ""); // YYYYMM
  const lastStudent = await prisma.student.findFirst({
    where: {
      studentId: { startsWith: `COACH-${currentYearMonth}` }
    },
    orderBy: { studentId: "desc" }
  });

  let nextNumber = "0001"; // Default if no previous student
  if (lastStudent) {
    const lastNumber = parseInt(lastStudent.studentId.slice(-4), 10);
    nextNumber = String(lastNumber + 1).padStart(4, "0");
  }

  const studentId = `COACH-${currentYearMonth}-${nextNumber}`;

  // Create the new student with generated studentId
  const student = await prisma.student.create({
    data: {
      studentId,
      ...req.body
    }
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student created successfully",
    data: student
  });
});


export const getAllStudentController = catchAsync(async (req, res) => {
  // const result = await prisma.student.findMany();

  const result = await new QueryBuilder("student", req.query)
    .search(["firstName", "lastName", "email", "phone", "schoolName"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .include({
      Batch: true,
      // Batch: {
      //   select: {
      //     batchName: true,
      //   },
      // },
    })
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
