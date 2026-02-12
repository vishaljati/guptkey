import {Router} from "express"
import { registerUser } from '../controllers/auth.controllers.js'

const router = Router();

router.post("/signup", registerUser);

export default router