import { Router } from "express";
import classRouts from "./classRoutes/classRoutes";
import shiftRouts from "./shiftRoutes/shiftRoutes";
import batchRouts from "./batchRoutes/batchRoutes";
import studentRouts from "./studentRoutes/studentRoutes";
import authRouts from "./auth.rout";
import bulkSmsRouts from "./bulkSma/bulkSma.rout";
import paymentRouts from "./paymentRoutes/paymentRoutes";
import costRouts from "./costRoutes/costRoutes";

const protectedRoutes = [
  { path: "/login", route: authRouts },
  { path: "/class", route: classRouts },
  { path: "/shift", route: shiftRouts },
  { path: "/batch", route: batchRouts },
  { path: "/student", route: studentRouts },
  { path: "/payment", route: paymentRouts },
  { path: "/cost", route: costRouts },
  { path: "/bulk", route: bulkSmsRouts },
];

const mainRouter = Router();

protectedRoutes.forEach((route) => {
  mainRouter.use(route.path, route.route);
});

export default mainRouter;