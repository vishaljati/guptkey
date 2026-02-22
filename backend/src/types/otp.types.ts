import { Types } from "mongoose";

export interface otpModel {
    _id: Types.ObjectId;
    userId:Types.ObjectId;
    email: string;
    hashedOtp: string;
    expiresAt: Date;
    attempts: number;
    createdAt: Date;
    updatedAt: Date;
}