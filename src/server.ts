import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import * as dotenv from "dotenv";
import dataSigner from "./data-signer.ts";

dotenv.config();
const app: Application = express();
const port = 3000;
const payload = {
  username: "julio",
  sessionID: 746746,
};
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "everything is up" });
});
app.post("/user-auth", async (req: Request, res: Response) => {
  try {
    const signature = await dataSigner(payload);
    res.status(200).json({ signature: signature });
  } catch (err) {
    console.error("Error: Internal server error:", err);
    res
      .status(500)
      .send("Something went wrong with the request. Please try again later");
  }
});

app.listen(port, () => {
  console.log("Server is up on port", port);
  console.log(process.env.VAULT_TOKEN);
});
