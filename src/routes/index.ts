import { Router } from "express";


const unprotectedRoutes = [
  {
    path: "/login",
  },
];

const protectedRoutes = [
  { path: "/test", route: testRoutes },


];

const mainRouter = Router();

protectedRoutes.forEach((route) => {
  mainRouter.use(route.path, route.route);
});

export default mainRouter;
