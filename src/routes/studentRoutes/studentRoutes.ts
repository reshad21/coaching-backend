import { createClassController } from "@/controllers/classController/classController";
import { CreateStudentController } from "@/controllers/studentController/studentController";
import { Router } from "express";

const studentRouts = Router();

studentRouts.post("/", CreateStudentController);

export default studentRouts;
