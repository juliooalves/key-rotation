import { Router } from "express";
import JWTController from "../controllers/jwt-controller.ts";
import JWTMiddleware from "../middlewares/session-middleware.ts";
const jwtRouter = Router();
const jwtController = new JWTController();

jwtRouter.post("/jwt-generator", jwtController.tokenGenerator);

jwtRouter.post("/jwt-auth", jwtController.authToken);

export default jwtRouter;
