import { Router } from "express";
import JWTController from "../controllers/jwt-controller.ts";
import JWTMiddleware from "../middleware/session-middleware.ts";
const routerJwt = Router();
const jwtController = new JWTController();

routerJwt.post("/jwt-generator", jwtController.tokenGenerator);

routerJwt.post("/jwt-auth", jwtController.authToken);

export default routerJwt;
