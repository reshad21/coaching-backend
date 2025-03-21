import { Router } from "express";
import testRouts from "./testRout/testRout";




const protectedRoutes = [
  { path: "/test", route: testRouts },


];

const mainRouter = Router();

protectedRoutes.forEach((route) => {
  mainRouter.use(route.path, route.route);
});

export default mainRouter;
