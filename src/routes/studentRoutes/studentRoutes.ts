
import { createStudentController, deleteStudentController, getAllStudentController, getStudentControllerById, updateStudentController } from "@/controllers/studentController/studentController";
import { Router } from "express";

const studentRouts = Router();


studentRouts.post("/", createStudentController);
studentRouts.get("/", getAllStudentController);
studentRouts.get("/:id", getStudentControllerById);
studentRouts.patch("/:id", updateStudentController);
studentRouts.delete("/:id", deleteStudentController);

export default studentRouts;
