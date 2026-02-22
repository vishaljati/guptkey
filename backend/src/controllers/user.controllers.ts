import { type Request, type Response } from "express"
import { AsyncHandler, ApiError, ApiResponse, generateSecureOTP } from "../utils/index.js";
import { Otp } from "../models/otp.models.js";
import { User } from "../models/user.models.js";
import { Types } from "mongoose";
import crypto from "crypto";
import { sendOTPEmail } from "../utils/sendEmail.js";

const requestPasswordReset = AsyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword } = req.body;
    const userId = req.user._id;

    if (!oldPassword) {
      throw new ApiError(400, "Current password required");
    }

    const user = await User.findById(userId).select("+password");
    if (!user) throw new ApiError(404, "User not found");

    const valid = await user.isPasswordCorrect(oldPassword);
    if (!valid) throw new ApiError(400, "Invalid password");

    // Prevent spam: only one active token
    const existingToken = await Otp.findOne({ userId });
    if (existingToken) {
      throw new ApiError(429, "Reset already requested. Check email.");
    }

    const otp = generateSecureOTP();

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Send email first
    await sendOTPEmail(user.email, otp);

    await Otp.create({
      userId,
      hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "OTP sent to your email"));
  }
);
const changePasswordWithOtp = AsyncHandler(
  async (req: Request, res: Response) => {
    const { otp, newPassword } = req.body;
    const userId = req.user._id;

    if (!otp || !newPassword) {
      throw new ApiError(400, "All fields required");
    }

    if (newPassword.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters");
    }

    const resetToken = await Otp.findOne({ userId });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    if (resetToken.attempts >= 5) {
      await resetToken.deleteOne();
      throw new ApiError(429, "Too many failed attempts.Try again later");
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(hashedOtp),
      Buffer.from(resetToken.hashedOtp)
    );

    if (!isValid) {
      resetToken.attempts += 1;
      await resetToken.save();
      throw new ApiError(400, "Invalid or expired OTP");
    }

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    user.password = newPassword;
    user.refreshToken = undefined; // force logout all sessions

    await user.save();

    await resetToken.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, "Password changed successfully"));
  }
);
const getUserProfile = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password -refreshToken -__v");   
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    return res.status(200).json(new ApiResponse(200, "User profile fetched successfully", user))
})

export {
    requestPasswordReset,
    changePasswordWithOtp,
    getUserProfile
};