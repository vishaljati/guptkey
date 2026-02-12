import mongoose from "mongoose";

export interface IUser {
  
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  mobile_no?: number;
  password: string;
  isVerified: boolean
  refreshToken?: string
  createdAt: Date;
  updatedAt: Date;

}
export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;

}
