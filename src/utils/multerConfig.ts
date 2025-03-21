import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// Store file in memory to process images with Sharp
const storage = multer.memoryStorage();

// Allowed file types (Images + PDFs)
const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, JPG, and PDF files are allowed!"));
  }
};

// Configure Multer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter,
});

export default upload;
