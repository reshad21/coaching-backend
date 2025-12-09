import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";

export const createSiteSettingController = catchAsync(async (req, res) => {
  const { brandName, logo, favicon } = req?.body;

  // Check if a site setting already exists (typically only one record)
  const existingSetting = await prisma.siteSetting.findFirst();
  if (existingSetting) {
    return res.status(400).json({
      success: false,
      message: "Site setting already exists. Please update instead.",
    });
  }

  const result = await prisma.siteSetting.create({
    data: {
      brandName,
      logo,
      favicon,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Site Setting Created Successfully",
    data: result,
  });
});

export const getAllSiteSettingController = catchAsync(async (req, res) => {
  const result = await prisma.siteSetting.findMany();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all site settings Successfully",
    data: result,
  });
});

export const getSiteSettingControllerById = catchAsync(async (req, res) => {
  const { id } = req?.params;

  const result = await prisma.siteSetting.findFirst({
    where: {
      id,
    },
  });

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Site setting not found",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get single site setting successful",
    data: result,
  });
});

export const deleteSiteSettingController = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if the site setting exists
  const existingSetting = await prisma.siteSetting.findUnique({
    where: { id },
  });

  if (!existingSetting) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Site setting not found",
    });
  }

  // Delete the site setting
  const result = await prisma.siteSetting.delete({
    where: { id },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Site setting deleted successfully",
    data: result,
  });
});

export const updateSiteSettingController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if the site setting exists
  const existingSetting = await prisma.siteSetting.findUnique({
    where: { id },
  });

  if (!existingSetting) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Site setting not found",
    });
  }

  // Update site setting with partial data
  const updatedSetting = await prisma.siteSetting.update({
    where: { id },
    data: updateData,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Site setting updated successfully",
    data: updatedSetting,
  });
});
