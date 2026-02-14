import mongoose from "mongoose";

export interface IEncryptedPassword {

    userId: mongoose.Types.ObjectId;

    encryptedData: string;     // Encrypted JSON string (ciphertext)
    iv: string;                // Initialization vector (base64)
    salt: string;           

    createdAt: Date;
    updatedAt: Date;

}