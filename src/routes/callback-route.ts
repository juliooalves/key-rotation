import { Router, type Request, type Response, type Next } from "express";

const callBackRouter = Router();

callBackRouter.use((req: Request, res: Response, next: Next) => {
  res.status(404).json({ message: "This page does not exist" });
});

export default callBackRouter;
