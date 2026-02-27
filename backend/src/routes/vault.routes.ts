import { Router } from "express";
import {
  updatePasswordVault,
  getPasswordVault,
} from "../controllers/vault.controllers.js";

import { verifyUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyUser);

router.patch("/update", updatePasswordVault);
router.get("/get", getPasswordVault);



export default router;
