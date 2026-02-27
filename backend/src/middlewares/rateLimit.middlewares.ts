import rateLimit from "express-rate-limit";
import { type Request, type Response } from "express";

export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes

  max: 100, // limit each IP to 100 requests per window

  standardHeaders: true, // Return rate limit info in headers

  legacyHeaders: false, // Disable X-RateLimit-* headers

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },

  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Rate limit exceeded. Try again in 15 minutes.",
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // Only 10 login attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});
