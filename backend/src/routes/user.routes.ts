import { Router } from "express";
import {
  requestPasswordReset,
  changePasswordWithOtp,
  getUserProfile,
  requestOtpForDeleteAccount,
  confirmDeleteAccount,
  cancelAccountDeletion
} from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyUser)

router.post("/password/reset-request", requestPasswordReset);
router.patch("/password/reset", changePasswordWithOtp);
router.get("/profile", getUserProfile);
router.post("/delete/request", requestOtpForDeleteAccount);
router.post("/delete/confirm", confirmDeleteAccount);
router.post("/delete/cancel", cancelAccountDeletion);

export default router;