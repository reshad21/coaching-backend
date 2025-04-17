
import { loginController } from "@/controllers/auth/auth";
import { Router } from "express";

const authRouts = Router();
authRouts.post("/",loginController);


export default authRouts;
