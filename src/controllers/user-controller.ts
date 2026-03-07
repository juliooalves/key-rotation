import type { Request, Response } from "express";
import * as jose from "jose";
export default class UserController {
  public userLogin = (req: Request, res: Response) => {
    try {
      const jwt = req.headers["authorization"].split(" ")[1];
      const decodedToken = jose.decodeJwt(jwt);
      return res.status(200).send(`Welcome user ${decodedToken.email}!!`);
    } catch (err) {
      return res.status(401).json({
        message: "Server error when tried to load user's account",
        error: err,
      });
    }
  };
}
