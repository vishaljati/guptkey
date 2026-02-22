import nodemailer, { SentMessageInfo } from "nodemailer";
import { otpTemplate, welcomeTemplate } from "./emailTemplate.js";

const createTransporter = () => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email credentials not loaded from environment");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

export const sendMail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<SentMessageInfo> => {
  const transporter = createTransporter();

  return transporter.sendMail({
    from: `"GuptKey" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

export const sendOTPEmail = async (to: string, otp: string) => {
  return sendMail(to, "Your GuptKey Verification Code", otpTemplate(otp));
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  return sendMail(to, "Welcome to GuptKey!", welcomeTemplate(name));
};