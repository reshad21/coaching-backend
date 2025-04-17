import { Router } from "express";
import testRouts from "./testRout/testRout";
import classRouts from "./classRoutes/classRoutes";
import shiftRouts from "./shiftRoutes/shiftRoutes";
import batchRouts from "./batchRoutes/batchRoutes";
import studentRouts from "./studentRoutes/studentRoutes";

const protectedRoutes = [
  { path: "/test", route: testRouts },
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