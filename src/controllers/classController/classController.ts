import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import exp from "constants";
import { QueryBuilder } from "@/builders/builders";

export const createClassController = catchAsync(async (req, res) => {
  const { className } = req?.body;
  // const data = req.body;

  const findClass = await prisma.class.findFirst({
    where: {
      className: className,
    },
  });
  if (findClass) {
    return res.status(400).json({
      success: false,
      message: "Class already exists !!",
    });
  }

  const result = await prisma.class.create({
    data: {
      className,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Class Create Successfully",
    data: result,
  });
});

export const getAllClassController = catchAsync(async (req, res) => {
  // const result = await prisma.class.findMany();

  const result = await new QueryBuilder("class", req.query)
    .search(["className"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all class Successfully",
    data: result,
  });
});

export const getClassControllerById = catchAsync(async (req, res) => {
  const { id } = req?.params;

  const result = await prisma.class.findFirst({
    where: {
      id,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get single class successful",
    data: result,
  });
});

export const deleteClassController = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if the class exists
  const existingClass = await prisma.class.findUnique({
    where: { id },
  });

  if (!existingClass) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Class not found",
    });
  }

  // Delete the batch
  const result = await prisma.class.delete({
    where: { id },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Class deleted successfully",
    data: result,
  });
});

export const updateClassController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if the vacation exists
  const existingClass = await prisma.class.findUnique({
    where: { id },
  });

  if (!existingClass) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Class not found",
    });
  }

  // Update vacation with partial data
  const updatedClass = await prisma.class.update({
    where: { id },
    data: updateData,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Class updated successfully",
    data: updatedClass,
  });
});
