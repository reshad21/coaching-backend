import {
  createClassController,
  deleteClassController,
  getAllClassController,
  getClassControllerById,
  updateClassController,
} from "@/controllers/classController/classController";
import { Router } from "express";

const classRouts = Router();

classRouts.post("/", createClassController);
classRouts.get("/", getAllClassController);
classRouts.get("/:id", getClassControllerById);
classRouts.patch("/:id", updateClassController);
classRouts.delete("/:id", deleteClassController);

export default classRouts;
