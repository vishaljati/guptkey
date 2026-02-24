import mongoose, { Schema, type Model } from "mongoose";
import { type IEncryptedPassword } from "../types/passwordVault.types.js";

const EncryptedPasswordSchema = new Schema<
  IEncryptedPassword,
  Model<IEncryptedPassword, {}, {}>
>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    encryptedData: {
      type: String,
      required: true,
    },

    iv: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const EncryptedPassword = mongoose.model<
  IEncryptedPassword,
  Model<IEncryptedPassword, {}, {}>
>("EncryptedPassword", EncryptedPasswordSchema);
