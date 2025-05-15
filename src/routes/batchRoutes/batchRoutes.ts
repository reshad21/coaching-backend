import {
  createBatchController,
  deleteBatchController,
  getAllBatchController,
  getBatchControllerById,
  getBatchInfoControllerById,
  updateBatchController,
} from "@/controllers/BatchController/batchController";
import auth from "@/middleware/auth";

import { Router } from "express";

const batchRouts = Router();

batchRouts.post("/",auth(), createBatchController);
batchRouts.get("/", getAllBatchController);
batchRouts.get("/:id", getBatchControllerById);
batchRouts.get("/batch-info/:id", getBatchInfoControllerById);
batchRouts.patch("/:id", updateBatchController);
batchRouts.delete("/:id", deleteBatchController);

export default batchRouts;
