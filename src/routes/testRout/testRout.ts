import { testController } from "@/controllers/Test/test";
import { Router } from "express";


const testRouts = Router();

testRouts.post("/", testController);

export default testRouts;
