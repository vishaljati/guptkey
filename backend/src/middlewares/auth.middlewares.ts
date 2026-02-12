import { AsyncHandler, ApiError } from "../utils/index.js";
import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.models.js"
import { type AccessTokenPayload } from "../types/jwt.types.js";



export const verifyUser = AsyncHandler(async (
    req: Request,
    _,
    next: NextFunction) => {


    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized request");

    }
    let decoded: JwtPayload | string;

    try {
        decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        );

    } catch (error) {
        throw new ApiError(401, "Invalid Access Token");
    }

    if (typeof decoded === "string") {
        throw new ApiError(401, "Invalid Access Token");
    }
    const { _id } = decoded as AccessTokenPayload;
    const user = await User.findById(_id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(401, "Invalid Access Token");
    }

    req.user=user
    
    next();
})