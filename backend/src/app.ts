import express, { type Application,type Request,type Response } from "express";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: process.env.REACT_CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

import authRouter from "./routes/auth.routes.js"

app.use("/api/v1/auth",authRouter)

export default app;
