import { bulkController } from "@/controllers/bulkSms/bulkSms";
import { Router } from "express";

const bulkSmsRouts = Router();


bulkSmsRouts.get("/", bulkController);


export default bulkSmsRouts;