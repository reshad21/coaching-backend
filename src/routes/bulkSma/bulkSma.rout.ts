import { batchBulkMsgController, bulkController, classBulkMsgController, singleMessageMsgController } from "@/controllers/bulkSms/bulkSms";
import { Router } from "express";

const bulkSmsRouts = Router();


bulkSmsRouts.get("/", bulkController);
bulkSmsRouts.post("/class", classBulkMsgController);
bulkSmsRouts.post("/batch", batchBulkMsgController);
bulkSmsRouts.post("/single-student", singleMessageMsgController);


export default bulkSmsRouts;