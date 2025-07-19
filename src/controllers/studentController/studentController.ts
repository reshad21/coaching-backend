import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { QueryBuilder } from "@/builders/builders";
import AppError from "@/errors/AppError";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";

export const createStudentController = catchAsync(async (req, res) => {
  const {
    dateOfBirth,
    classId,
    batchId,
    shiftId,
    image,
    admissionFees,
    ...restBody
  } = req.body;



  const currentYearMonth = new Date()
    .toISOString()
    .slice(0, 7)
    .replace("-", "");
  const lastStudent = await prisma.student.findFirst({
    where: {
      studentId: { startsWith: `COACH-${currentYearMonth}` },
    },
    orderBy: { studentId: "desc" },
  });

  let nextNumber = "0001";
  if (lastStudent) {
    const lastNumber = parseInt(lastStudent.studentId.slice(-4), 10);
    nextNumber = String(lastNumber + 1).padStart(4, "0");
  }

  const studentId = `COACH-${currentYearMonth}-${nextNumber}`;

  // Fetch batch name using batchId
  const findBatch = await prisma.batch.findFirst({
    where: { id: batchId },
  });
  if (!findBatch) {
    throw new AppError(404, "Batch not found");
  }

  // Fetch class name using classId
  const findclass = await prisma.class.findFirst({
    where: { id: classId },
  });
  if (!findclass) {
    throw new AppError(404, "Class not found");
  }

  // Fetch shift name using shiftId
  const findShift = await prisma.shift.findFirst({
    where: { id: shiftId },
  });
  if (!findShift) {
    throw new AppError(404, "Shift not found");
  }

  const newStudent = await prisma.student.create({
    data: {
      studentId,
      image,
      dateOfBirth: new Date(dateOfBirth),
      batchName: findBatch?.batchName,
      className: findclass?.className,
      shiftName: findShift?.shiftName,
      admissionFees: Number(admissionFees), // ✅ Convert to number
      batchId,
      classId,
      shiftId,
      ...restBody,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student created successfully",
    data: newStudent,
  });
});


export const getAllStudentController = catchAsync(async (req, res) => {
  // const result = await prisma.student.findMany();

  const result = await new QueryBuilder("student", req.query)
    .search(["firstName", "lastName", "phone", "schoolName", "studentId"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .include({
      Batch: true,
      Class: true,
      Payment: true,
    })
    .execute();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all student Successfully",
    meta: result?.meta,
    data: result?.data ? result?.data : result,
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
  const data = req.body;

  const existingStudent = await prisma.student.findUnique({
    where: { id },
  });

  if (!existingStudent) {
    throw new AppError(400, "Student not found");
  }

  const updatedStudent = await prisma.student.update({
    where: { id },
    data: {
      ...data,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student updated successfully",
    data: updatedStudent,
  });
});
