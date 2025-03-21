import {
  createBatchController,
  deleteBatchController,
  getAllBatchController,
  getBatchControllerById,
  updateBatchController,
} from "@/controllers/BatchController/batchController";

import { Router } from "express";

const batchRouts = Router();

batchRouts.post("/", createBatchController);
batchRouts.get("/", getAllBatchController);
batchRouts.get("/:id", getBatchControllerById);
batchRouts.patch("/:id", updateBatchController);
batchRouts.delete("/:id", deleteBatchController);

export default batchRouts;
