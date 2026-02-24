import { Router } from "express";
import {
  requestPasswordReset,
  changePasswordWithOtp,
  getUserProfile,
  deleteAccount
} from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyUser)

router.post("/password/reset-request",requestPasswordReset);
router.patch("/password/reset",changePasswordWithOtp);
router.get("/profile",getUserProfile);
router.delete("/delete",deleteAccount);

export default router;