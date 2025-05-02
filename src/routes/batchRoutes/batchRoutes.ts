import {
  createBatchController,
  deleteBatchController,
  getAllBatchController,
  getBatchControllerById,
  updateBatchController,
} from "@/controllers/BatchController/batchController";
import auth from "@/middleware/auth";

import { Router } from "express";

const batchRouts = Router();

batchRouts.post("/",auth(), createBatchController);
batchRouts.get("/", getAllBatchController);
batchRouts.get("/:id", getBatchControllerById);
batchRouts.patch("/:id", updateBatchController);
batchRouts.delete("/:id", deleteBatchController);

export default batchRouts;
