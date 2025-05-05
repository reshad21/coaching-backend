
import { createStudentController, deleteStudentController, getAllStudentController, getStudentControllerById, updateStudentController } from "@/controllers/studentController/studentController";
import upload from "@/utils/multerConfig";
import { Router } from "express";

const studentRouts = Router();


studentRouts.post("/", upload.fields([
    { name: "image", maxCount: 1 },
]), createStudentController);

studentRouts.get("/", getAllStudentController);
studentRouts.get("/:id", getStudentControllerById);
studentRouts.patch("/:id", updateStudentController);
studentRouts.delete("/:id", deleteStudentController);

export default studentRouts;

