import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import * as dotenv from "dotenv";
import dataSigner from "./data-signer.ts";
import routerJwt from "./routes/jwt-route.ts";
import JWTMiddleware from "./middleware/session-middleware.ts";
import { initVaultClient } from "./vault.ts";
dotenv.config();
const app: Application = express();
const port = 3000;

const payload = {
  id: "783rht",
  email: "lester123@gmail.com",
};

app.use(express.json());
app.post("/user-auth", JWTMiddleware, async (req: Request, res: Response) => {
  try {
    res.status(200).json({ signature: "teste" });
  } catch (err) {
    console.error("Error: Internal server error:", err);
    res
      .status(500)
      .send("Something went wrong with the request. Please try again later");
  }
});

app.use("/api/users", routerJwt);

initVaultClient().then(() => {
  app.listen(port, () => {
    console.log("Server is up on port", port);
    console.log(process.env.VAULT_TOKEN);
  });
});
