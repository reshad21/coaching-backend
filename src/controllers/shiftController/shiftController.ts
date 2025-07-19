import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { QueryBuilder } from "@/builders/builders";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";


export const createShiftController = catchAsync(async (req, res) => {
  const { shiftName } = req?.body;
  // const data = req.body;

  const findShift = await prisma.shift.findFirst({
    where: {
      shiftName: shiftName,
    },
  });
  if (findShift) {
    return res.status(400).json({
      success: false,
      message: "shift already exists !!",
    });
  }

  const result = await prisma.shift.create({
    data: {
      shiftName,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "shift Create Successfully",
    data: result,
  });
});

export const getAllShiftController = catchAsync(async (req, res) => {
  // const result = await prisma.shift.findMany();

  const result = await new QueryBuilder("shift", req.query)
    .search(["shiftName"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all shift Successfully",
    data: result,
  });
});

// This controller retrieves all shifts and calculates the percentage of students in each shift
// It returns an array of strings in the format "shiftName percentage%"
export const getAllShiftStudentController = catchAsync(async (req, res) => {
  const shifts = await prisma.shift.findMany({
    select: {
      shiftName: true,
      Student: {
        select: { id: true } // only need id for count
      }
    },
  });

  // Total students count across all shifts
  const totalStudents = shifts.reduce(
    (sum, shift) => sum + shift.Student.length,
    0
  );

  // Prepare result array with "shiftName percentage%"
  const result = shifts.map((shift) => {
    const count = shift.Student.length;
    const percentage = totalStudents
      ? ((count / totalStudents) * 100).toFixed(0)
      : "0";

    return `${shift.shiftName} ${percentage}%`;
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all shift student percentages successfully",
    data: result,
  });
});

export const getShiftControllerById = catchAsync(async (req, res) => {
  const { id } = req?.params;

  const result = await prisma.shift.findFirst({
    where: {
      id,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get single shift successful",
    data: result,
  });
});

export const deleteShiftController = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if the shift exists
  const existingShift = await prisma.shift.findUnique({
    where: { id },
  });

  if (!existingShift) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "shift not found",
    });
  }

  // Delete the batch
  const result = await prisma.shift.delete({
    where: { id },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "shift deleted successfully",
    data: result,
  });
});

export const updateShiftController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if the vacation exists
  const existingShift = await prisma.shift.findUnique({
    where: { id },
  });

  if (!existingShift) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "shift not found",
    });
  }

  // Update vacation with partial data
  const updatedShift = await prisma.shift.update({
    where: { id },
    data: updateData,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "shift updated successfully",
    data: updatedShift,
  });



});
