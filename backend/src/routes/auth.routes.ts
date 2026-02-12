import {Router} from "express"
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

 } from '../controllers/auth.controllers.js'
import { verifyUser } from "../middlewares/auth.middlewares.js"

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/accesstoken", refreshAccessToken);
router.post("/logout", verifyUser ,logoutUser );

export default router