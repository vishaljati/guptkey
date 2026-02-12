import mongoose from "mongoose";

export interface IEncryptedPassword {

    userId: mongoose.Types.ObjectId;

    encryptedData: string;     // Encrypted JSON string (ciphertext)
    iv: string;                // Initialization vector (base64)
    authTag: string;           // GCM authentication tag (base64)

    siteHint?: string;         // Optional non-sensitive metadata
    createdAt: Date;
    updatedAt: Date;

}