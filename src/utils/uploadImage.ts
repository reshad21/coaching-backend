import sharp from "sharp";
import fs from "fs";
import path from "path";
import { Express } from "express";
import { fileURLToPath } from "url";
import AppError from "@/errors/AppError";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  try {
    if (!file) {
      throw new AppError(400, "No file uploaded");
    }

    // Define the directories for images and files
    const publicImageDir = path.join(__dirname, "../..", "public/images");
    const publicFileDir = path.join(__dirname, "../..", "public/file");

    // Ensure that the directories exist
    if (!fs.existsSync(publicImageDir)) {
      fs.mkdirSync(publicImageDir, { recursive: true });
    }
    if (!fs.existsSync(publicFileDir)) {
      fs.mkdirSync(publicFileDir, { recursive: true });
    }

    let filePath: string;
    let fileUrl: string;

    if (file.mimetype.startsWith("image/")) {
      // If the file is an image, save it in the 'public/images' folder
      const filename = `image-${Date.now()}.webp`;
      filePath = path.join(publicImageDir, filename);

      // Process image with Sharp
      await sharp(file.buffer)
        .resize(800, 800, { fit: "inside" }) // Resize to max 800x800
        .toFormat("webp")
        .webp({ quality: 80 })
        .toFile(filePath); // Save image file

      fileUrl = `/images/${filename}`; // URL to access the image

    } else if (file.mimetype === "application/pdf") {
      // If the file is a PDF, save it in the 'public/file' folder
      const filename = `document-${Date.now()}.pdf`;
      filePath = path.join(publicFileDir, filename);

      // Save PDF file
      fs.writeFileSync(filePath, file.buffer);

      fileUrl = `/file/${filename}`; // URL to access the PDF

    } else {
      throw new Error("Unsupported file type");
    }

    return fileUrl;
  } catch (error) {
    console.error("Error processing file:", error);
    throw new Error("File processing failed");
  }
};

export default uploadFile;
