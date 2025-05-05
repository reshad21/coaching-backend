import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { QueryBuilder } from "@/builders/builders";
import AppError from "@/errors/AppError";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import uploadImage from "@/utils/uploadImage";

export const createStudentController = catchAsync(async (req, res) => {
  const { dateOfBirth, classId, batchId, shiftId } = req.body;

  const body = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files.image || files.image.length === 0) {
    throw new AppError(400, "No profile image uploaded");
  }

  const imageUrl = await uploadImage(files.image[0]);

  // Generate Student ID (e.g., COACH-202504-0001)
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
      image: imageUrl,
      dateOfBirth: new Date(dateOfBirth),
      batchName: findBatch?.batchName,
      className: findclass?.className,
      shiftName: findShift?.shiftName,
      ...body,
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
    .search(["firstName", "lastName", "email", "phone", "schoolName"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .include({
      Batch: true,
      Class: true,
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
