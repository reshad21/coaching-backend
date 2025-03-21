import { createClassController } from "@/controllers/classController/classController";
import { createShiftController } from "@/controllers/shiftController/shiftController";
import { Router } from "express";


const shiftRouts = Router();

shiftRouts.post("/", createShiftController);

export default shiftRouts;