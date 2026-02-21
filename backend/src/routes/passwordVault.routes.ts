import { Router } from "express";
import {
    updatePasswordVault,
    getPasswordVault,
    deletePasswordVault,
    getSaltfromDB
} from '../controllers/passwordVault.controllers.js'

import { verifyUser } from "../middlewares/auth.middlewares.js"

const router = Router();

router.use(verifyUser)


router.patch("/update", updatePasswordVault)
router.get("/get", getPasswordVault)
router.get("/getSalt", getSaltfromDB)
router.delete("/delete", deletePasswordVault)

export default router;