import { bulkController, classBulkMsgController } from "@/controllers/bulkSms/bulkSms";
import { Router } from "express";

const bulkSmsRouts = Router();


bulkSmsRouts.get("/", bulkController);
bulkSmsRouts.post("/class", classBulkMsgController);


export default bulkSmsRouts;