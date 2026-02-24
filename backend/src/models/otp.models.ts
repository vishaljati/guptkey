import mongoose, { Schema, Types } from "mongoose";
import type { otpModel } from "../types/otp.types.js";
const otpSchema = new Schema<otpModel>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    hashedOtp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto delete after expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model<otpModel>("Otp", otpSchema);
