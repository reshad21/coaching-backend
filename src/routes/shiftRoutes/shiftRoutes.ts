import { createShiftController, deleteShiftController, getAllShiftController, getShiftControllerById, updateShiftController } from "@/controllers/shiftController/shiftController";
import { Router } from "express";






const shiftRouts = Router();

shiftRouts.post("/", createShiftController);
shiftRouts.get("/", getAllShiftController);
shiftRouts.get("/:id", getShiftControllerById);
shiftRouts.patch("/:id", updateShiftController);
shiftRouts.delete("/:id", deleteShiftController);




export default shiftRouts;