import express, {
  type Application,
  type Request,
  type Response,
  type Next,
} from "express";
import * as dotenv from "dotenv";
import jwtRouter from "./routes/jwt-route.ts";
import userRouter from "./routes/user-route.ts";
import callBackRouter from "./routes/callback-route.ts";
import vaultRouter from "./routes/vault-route.ts";
import { initVaultClient } from "./utils/vault.ts";
const app: Application = express();
const port = 3000;
dotenv.config();

app.use(express.json());
app.use("/api/auth", jwtRouter);
app.use("/home", userRouter);
app.use("/api/vault", vaultRouter);
app.use(callBackRouter);

initVaultClient().then(() => {
  app.listen(port, () => {
    console.log("Server is up on port: ", port);
  });
});
