import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  refreshToken?: string;
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;

}
export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;

}
