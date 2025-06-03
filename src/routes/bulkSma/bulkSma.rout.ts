import {
  allStudentBulkMsgController,
  batchBulkMsgController,
  bulkController,
  classBulkMsgController,
  shiftBulkMsgController,
  singleMessageMsgController,
} from "@/controllers/bulkSms/bulkSms";
import { Router } from "express";

const bulkSmsRouts = Router();

bulkSmsRouts.get("/", bulkController);
bulkSmsRouts.post("/class", classBulkMsgController);
bulkSmsRouts.post("/shift", shiftBulkMsgController);
bulkSmsRouts.post("/batch", batchBulkMsgController);
bulkSmsRouts.post("/all-student", allStudentBulkMsgController);
bulkSmsRouts.post("/single-student", singleMessageMsgController);

export default bulkSmsRouts;
