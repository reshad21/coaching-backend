import { getAllStudentPaymentController, getSingleStudentPaymentControllerById, paymentStudentController, updateStudentPaymentController } from "@/controllers/payment/paymentController";

import { Router } from "express";

const paymentRouts = Router();

// paymentRouts.post("/",auth(), paymentStudentController);
paymentRouts.post("/", paymentStudentController);
paymentRouts.get("/", getAllStudentPaymentController);
paymentRouts.get("/:id", getSingleStudentPaymentControllerById);
paymentRouts.patch("/:id", updateStudentPaymentController);

export default paymentRouts;
