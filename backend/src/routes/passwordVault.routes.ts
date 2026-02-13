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
router.post("/getvault", getPasswordVault)
router.post("/deletevault", deletePasswordVault)

export default router;