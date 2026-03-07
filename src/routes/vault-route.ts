import { Router } from "express";
import { vaultClient } from "../utils/vault.ts";
const vaultRouter = Router();

vaultRouter.post("/key-rotation", async (req, res) => {
  try {
    await vaultClient().write("identity/oidc/key/jwt-key/rotate");
    res.status(200).json({ message: "Key rotation succssful. JWKS updated " });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error when tried to rotate keys", error: err.message });
  }
});

export default vaultRouter;
