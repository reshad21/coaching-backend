
import { createBatchController } from "@/controllers/BatchController/batchController";

import { Router } from "express";


const batchRouts = Router();

batchRouts.post("/", createBatchController);

export default batchRouts;
