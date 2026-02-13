import { Router } from "express";
import {
    createPasswordVault,
    updatePasswordVault,
    getPasswordVault,
    deletePasswordVault
} from '../controllers/passwordVault.controllers.js'

import { verifyUser } from "../middlewares/auth.middlewares.js"

const router = Router();

router.use(verifyUser)

router.post("/createvault", createPasswordVault)
router.patch("/updatevault", updatePasswordVault)
router.get("/getvault", getPasswordVault)
router.delete("/deletevault", deletePasswordVault)

export default router;