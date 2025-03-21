import fs from "fs";
import path from "path";

export const deletePrevFile = (fileUrl: string) => {
  try {
    // Remove leading slash if present
    const cleanedPath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;

    // Get the absolute path to the file
    const absolutePath = path.join(process.cwd(), "public", cleanedPath);

    // Check if file exists before deleting
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`Deleted file: ${absolutePath}`);
    } else {
      console.log(`File not found: ${absolutePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
  }
};
