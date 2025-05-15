import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { QueryBuilder } from "@/builders/builders";

export const createBatchController = catchAsync(async (req, res) => {
  const data = req.body;

  // const findBatch = await prisma.batch.findFirst({
  //   where: {
  //     batchName: data.batchName,
  //   },
  // });
  // if (findBatch) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "batch already exists !!",
  //   });
  // }

  const result = await prisma.batch.create({
    data,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "batch Create Successfully",
    data: result,
  });
});

export const getAllBatchController = catchAsync(async (req, res) => {
  
  const result = await new QueryBuilder("batch", req.query)
    .search(["batchName"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .include({
      Class: {
        select: {
          className: true,
        },
      },
      Shift: {
        select: {
          shiftName: true,
        },
      },
      students: true,
    })
    .execute();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all batch Successfully",
    data: result,
  });
});

export const getBatchControllerById = catchAsync(async (req, res) => {
  const { id } = req?.params;

  const result = await prisma.batch.findFirst({
    where: {
      id,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get single batch successful",
    data: result,
  });
});
export const getBatchInfoControllerById = catchAsync(async (req, res) => {
  const { id } = req?.params;

  const result = await prisma.batch.findFirst({
    where: {
      id,
    },
    select:{
      Class:{
        select:{
          className:true,
          id:true
        }
      },
      Shift:{
        select:{
          shiftName:true,
          id:true
        }
      }
    }
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get single batch info successful",
    data: result,
  });
});

export const deleteBatchController = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if the batch exists
  const existingBatch = await prisma.batch.findUnique({
    where: { id },
  });

  if (!existingBatch) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "batch not found",
    });
  }

  // Delete the batch
  const result = await prisma.batch.delete({
    where: { id },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "batch deleted successfully",
    data: result,
  });
});

export const updateBatchController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if the vacation exists
  const existingBatch = await prisma.batch.findUnique({
    where: { id },
  });

  if (!existingBatch) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "batch not found",
    });
  }

  // Update vacation with partial data
  const updatedBatch = await prisma.batch.update({
    where: { id },
    data: updateData,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "batch updated successfully",
    data: updatedBatch,
  });
});
