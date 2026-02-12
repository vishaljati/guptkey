import { User } from "../models/user.models.ts";

declare global {
    namespace Express {
        interface Request {
            user?: typeof User.prototype;
        }
    }
}