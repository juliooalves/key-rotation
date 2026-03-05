import type { Request, Response } from "express";
import userTokenAuth from "../auth/jwt-auth.ts";
import userTokenGenerator from "../auth/jwt-generator.ts";

interface UserData {
  id: string;
  email: string;
}

export default class JWTController {
  private userTokenAuth: (jwt: string) => string;
  private userTokenGenerator: (userData: userData) => string;

  constructor() {
    this.userTokenAuth = userTokenAuth;
    this.userTokenGenerator = userTokenGenerator;
  }
  public tokenGenerator = async (
    req: Request<unknown, unknown, UserData>,
    res: Response,
  ): Promise<string> => {
    try {
      const data = req.body;
      const token = await this.userTokenGenerator(data);
      return res.status(200).json({ token: token });
    } catch (err) {
      console.error("Error: internal server error on JWT Generator:", err);
      res.status(500).json({
        message: "Failed to load the JWT Generator endpoint correctly",
        error: err,
      });
    }
  };

  public authToken = async (
    req: Request<unknown, unknown, string>,
    res: Response,
  ): Promise<string> => {
    try {
      const data = req.body;
      const validatedToken = await this.userTokenAuth(data.token);
      res.status(200).json({ response: validatedToken });
    } catch (err) {
      console.error(
        "Error has ocurred when tried to access the JWT Auth endpoint",
        err.message,
      );
      res.status(500).json({
        message: "Failed to load the JWT Generator endpoint correctly",
        error: err,
      });
    }
  };
}
