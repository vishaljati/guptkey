import { type Request, type Response } from "express"
import { AsyncHandler, ApiError, ApiResponse, generateSecureOTP } from "../utils/index.js";
import { User } from "../models/user.models.js";
import { Types } from "mongoose";
import crypto from "crypto";

const requestPasswordReset = AsyncHandler(
    async (req: Request, res: Response) => {
        const { oldPassword } = req.body;
        const userId = req.user._id;

        if (!Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }

        if (!oldPassword) {
            throw new ApiError(400, "Current password is required");
        }

        const user = await User.findById(userId).select("+password");
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Current password is incorrect");
        }

        const otp = generateSecureOTP();

        // Hash OTP before storing
        const hashedOtp = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        user.otp = hashedOtp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await user.save();
        const email=user.email;
        await sendOtpEmail(email, otp);

        return res.status(200).json(new ApiResponse(200,"OTP sent to your email"));
    }
);

const changePasswordWithOtp = AsyncHandler(
  async (req: Request, res: Response) => {
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      throw new ApiError(400, "All fields are required");
    }
    const userId= req.user._id;

    if (!Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(userId).select("+otp +otpExpiry +password");

    if (!user || !user.otp || !user.otpExpiry) {
      throw new ApiError(400, "Invalid request");
    }

    // Check expiry
    if (user.otpExpiry < new Date()) {
      throw new ApiError(400, "OTP expired");
    }

    // Hash provided OTP
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOtp !== user.otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    // Hash new password
    user.password = newPassword;

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json(new ApiResponse(200, "Password changed successfully"));
  }
);
export {
    requestPasswordReset,
    changePasswordWithOtp
};