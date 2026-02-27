import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rateLimit.middlewares.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
const app: Application = express();

app.use(
  cors({
    origin: process.env.REACT_CLIENT_URL || "https://guptkey.vercel.app",
    credentials: true,
  })
);
app.use(apiLimiter);
app.use(cookieParser());
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

import authRouter from "./routes/auth.routes.js";
import passwordVaultRouter from "./routes/vault.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vault", passwordVaultRouter);

app.use(errorHandler);
export default app;
