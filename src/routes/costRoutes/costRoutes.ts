import { CreateAcademicCostController, getAcademicCostControllerById, getAllAcademicCostController, updateAcademicCostController } from "@/controllers/costingController/costingController";

import { Router } from "express";

const costRouts = Router();

// costRouts.post("/",auth(), paymentStudentController);
costRouts.post("/", CreateAcademicCostController);
costRouts.get("/", getAllAcademicCostController);
costRouts.get("/:id", getAcademicCostControllerById);
costRouts.patch("/:id", updateAcademicCostController);

export default costRouts;
