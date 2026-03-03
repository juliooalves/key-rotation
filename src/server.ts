import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import * as dotenv from "dotenv";
import dataSigner from "./data-signer.ts";
import getUserToken from "./auth/jwt-auth.ts";

interface UserData {
  id: string;
  email: string;
}

dotenv.config();

const app: Application = express();
const port = 3000;
const payload = {
  id: "783rht",
  email: "lester123@gmail.com",
};
app.use(express.json());
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "everything is up" });
});
app.post("/user-auth", async (req: Request, res: Response) => {
  try {
    const signature = await dataSigner(payload);
    res.status(200).json({ signature: sinature });
  } catch (err) {
    console.error("Error: Internal server error:", err);
    res
      .status(500)
      .send("Something went wrong with the request. Please try again later");
  }
});
app.post(
  "/jwt-auth",
  async (req: Request<unknown, unknown, UserData>, res: Response) => {
    try {
      const data = req.body;
      const token = await getUserToken(data);
      res.status(200).json({ user_id: `${payload.id}`, token: token });
    } catch (err) {
      console.error("Error: internal server error on JWT Auth:", err);
      res.status(500).json({
        message: "Failed to load the JWT Auth endpoint correctly",
        error: err,
      });
    }
  },
);

app.listen(port, () => {
  console.log("Server is up on port", port);
  console.log(process.env.VAULT_TOKEN);
});
