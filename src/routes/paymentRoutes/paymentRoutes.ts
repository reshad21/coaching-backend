import {
  createBatchController,
  deleteBatchController,
  getAllBatchController,
  getBatchControllerById,
  getBatchInfoControllerById,
  updateBatchController,
} from "@/controllers/BatchController/batchController";
import { getAllStudentPaymentController, getSingleStudentPaymentControllerById, paymentStudentController } from "@/controllers/payment/paymentController";
import auth from "@/middleware/auth";

import { Router } from "express";

const paymentRouts = Router();

// paymentRouts.post("/",auth(), paymentStudentController);
paymentRouts.post("/", paymentStudentController);
paymentRouts.get("/", getAllStudentPaymentController);
paymentRouts.get("/:id", getSingleStudentPaymentControllerById);
// paymentRouts.get("/batch-info/:id", getBatchInfoControllerById);
// paymentRouts.patch("/:id", updateBatchController);
// paymentRouts.delete("/:id", deleteBatchController);

export default paymentRouts;
