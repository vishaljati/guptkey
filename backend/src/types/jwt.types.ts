import mongoose from "mongoose";

export interface AccessTokenPayload {
    _id: mongoose.Types.ObjectId;
    username: string,
    email: string,
    
}
export interface RefreshTokenPayload {
    _id: mongoose.Types.ObjectId;
    email: string,
    
}