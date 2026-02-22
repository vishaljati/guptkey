import { type Request, type Response } from "express"
import { AsyncHandler, ApiError, ApiResponse } from "../utils/index.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { type RefreshTokenPayload } from "../types/jwt.types.js";
import { EncryptedPassword } from "../models/passwordVault.model.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

const generateAccessAndRefreshTokens = async (userId: Types.ObjectId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Access token or Refresh token generation failed")
        }

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.log("ERROR :", error);
        throw new ApiError(500, "Something went wrong while generating Access and Refresh Token")
    }


}

const registerUser = AsyncHandler(async (req: Request, res: Response) => {

    const { name, email, password, encryptedData, iv, salt } = req.body
    if (!name || !email) {
        throw new ApiError(400, "Name and Email is required")
    }
    if (!password) {
        throw new ApiError(400, "Password is required")
    }
    if (!encryptedData || !iv || !salt) {
        throw new ApiError(400, "Encrypted data, IV and salt are required")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "Email already exists")
    }
    await User.create({
        name,
        email,
        password,
    })
    const createdUser = await User.findOne({ email }).select("-password -refreshToken -__v")
    if (!createdUser) {
        throw new ApiError(500, "User creation failed in DB")
    }
    const createdEncryptedPasswordVault = await EncryptedPassword.create({
        userId: createdUser._id,
        encryptedData,
        iv,
        salt
    })

    if (!createdEncryptedPasswordVault) {
        throw new ApiError(500, "Encrypted password vault creation failed in DB")
    }


    try {
        await sendWelcomeEmail(createdUser.email, createdUser.name)
    } catch (error) {
        console.error("Welcome Email failed:", error)
    }

    return res.status(201).json(
        new ApiResponse
            (201, "User registered successfully", createdUser))

})

const loginUser = AsyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body || {}
    if (!email || !password) {
        throw new ApiError(400, "Email and Password is required")

    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }
    const userId = user._id

    const userEncryptedPasswordVault = await EncryptedPassword.findOne({ userId: userId }).select("-__v -createdAt -updatedAt -userId")

    if (!userEncryptedPasswordVault) {
        throw new ApiError(404, "Encrypted password vault not found for the user")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userId);

    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "ACCESS & REFRESH TOKEN GENERATION FAILED")
    }

    const loggedInUser = await User.findById(userId).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    const responseData = {
        userData: {
            _id: loggedInUser?._id,
            name: loggedInUser?.name,
            email: loggedInUser?.email
        },
        encryptedData: userEncryptedPasswordVault.encryptedData,
        iv: userEncryptedPasswordVault.iv,
        salt: userEncryptedPasswordVault.salt
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "User logged in successfully", responseData))

})

const logoutUser = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id

    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }

    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(
            200,
            "User Logged out"
        ))

})

const refreshAccessToken = AsyncHandler(async (req: Request, res: Response) => {

    const cookies = req.cookies || {}
    const body = req.body || {}


    const incomingRefreshToken = cookies.refreshToken || body.refreshToken;


    if (!incomingRefreshToken || typeof incomingRefreshToken !== "string" || !incomingRefreshToken.trim()) {
        throw new ApiError(401, "Unauthorized request: Refresh token missing or invalid");
    }


    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
    ) as RefreshTokenPayload

    const user = await User.findById(decodedToken._id)

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
    }

    const option = {
        httpOnly: true,
        secure: true
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)


    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                "Access Token Refreshed Successfully",
                {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                },
            )
        )

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}