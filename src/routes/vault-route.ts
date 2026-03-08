import { Router, type Request, type Response } from "express";
import { vaultClient } from "../utils/vault.ts";
const vaultRouter = Router();

vaultRouter.post("/key-rotation", async (req: Request, res: Response) => {
  try {
    await vaultClient().write("identity/oidc/key/jwt-key/rotate");
    res.status(200).json({ message: "Key rotation succssful. JWKS updated " });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error when tried to rotate keys", error: err.message });
  }
});
vaultRouter.get("/jwks", async (req: Request, res: Response) => {
  try {
    const jwks = await vaultClient().read("identity/oidc/.well-known/keys");
    res.status(200).send(jwks);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error when tried to access JWKS endpoint",
        error: err.message,
      });
  }
});
export default vaultRouter;
