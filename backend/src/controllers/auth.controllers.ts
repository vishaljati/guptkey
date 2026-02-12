import { type Request, type Response } from "express"
import { AsyncHandler, ApiError, ApiResponse } from "../utils/index.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

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
    try {
        const { username, email, password } = req.body
        if (!username || !password) {
            throw new ApiError(400, "Username and Password is required")
        }
        if (!email) {
            throw new ApiError(400, "Email is required")
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            throw new ApiError(409, "Username or Email already exists")
        }

        const newUser = await User.create({
            username: username.toLowerCase(),
            email,
            password
        })
        const createdUser = await User.findById(newUser._id).select("-password -refreshTokens")
        if (!createdUser) {
            throw new ApiError(500, "User creation failed in DB")
        }

        //NOTE:Sending registration mail
        return res.status(201).json(
            new ApiResponse
                (201, "User registered successfully", createdUser).toJSON())
    } catch (error) {
        console.error("Something went wrong while registering user", error)
        return
    }


})

const loginUser = AsyncHandler(async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw new ApiError(400, "Email and Password is required")

        }
        const user = await User.findOne({ email })

        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password")
        }
        const userId = user._id
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userId)
        const loggedInUser = await User.findById(userId).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, "User logged in successfully", loggedInUser))


    } catch (error) {
        console.log("ERROR :", error);
        throw new ApiError(500, "Something went wrong while login user")
    }

})

const logoutUser = AsyncHandler(async (req: Request, res: Response) => {
    try {
        await User.findByIdAndUpdate(


            req.user._id,
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
    } catch (error) {
        console.error("Error while log out", error)
        return
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
}