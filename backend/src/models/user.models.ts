import { Schema, model, type Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type IUser, type IUserMethods } from "../types/userModel.types.js";
import {
  type AccessTokenPayload,
  type RefreshTokenPayload,
} from "../types/jwt.types.js";

const userSchema = new Schema<
  IUser,
  Model<IUser, {}, IUserMethods>,
  IUserMethods
>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const SALT_ROUNDS = 12;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  if (!password) {
    throw new Error("PASSWORD IS REQUIRED IN BCRYPT");
  }
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    } as AccessTokenPayload,
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "10m",
    }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    } as RefreshTokenPayload,
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "30m",
    }
  );
};

export const User = model<IUser, Model<IUser, {}, IUserMethods>>(
  "User",
  userSchema
);
