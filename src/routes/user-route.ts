import { Router } from "express";
import UserController from "../controllers/user-controller.ts";
import JWTMiddleware from "../middlewares/session-middleware.ts";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/", JWTMiddleware, userController.userLogin);

export default userRouter;
