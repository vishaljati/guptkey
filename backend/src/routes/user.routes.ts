import { Router } from "express";
import {
  requestPasswordReset,
  changePasswordWithOtp,
} from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyUser)

router.patch("/password/reset-request",requestPasswordReset);
router.patch("/password/reset",changePasswordWithOtp);

export default router;