import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/index.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
