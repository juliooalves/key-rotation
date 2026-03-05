import type { Request, Response, Next } from "express";
import userTokenAuth from "../auth/jwt-auth.ts";

export default async function JWTMiddleware(
  req: Request,
  res: Response,
  next: Next,
) {
  try {
    req.requestedAt = Date.now();
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }
    const validatedToken = await userTokenAuth(token);

    if (validatedToken.code && validatedToken.code.includes("ERR")) {
      return res.status(403).json({ message: "Invalid token" });
    }
    next();
  } catch (err) {
    console.error("Error on parsing the token on the middleware:", err.message);
    return;
  }
}
