import { Router } from "express";
import classRouts from "./classRoutes/classRoutes";
import shiftRouts from "./shiftRoutes/shiftRoutes";
import batchRouts from "./batchRoutes/batchRoutes";
import studentRouts from "./studentRoutes/studentRoutes";
import authRouts from "./auth.rout";

const protectedRoutes = [
  { path: "/login", route: authRouts },
  { path: "/class", route: classRouts },
  { path: "/shift", route: shiftRouts },
  { path: "/batch", route: batchRouts },
  { path: "/student", route: studentRouts },
];

const mainRouter = Router();

protectedRoutes.forEach((route) => {
  mainRouter.use(route.path, route.route);
});

export default mainRouter;
