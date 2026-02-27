import { Resend } from "resend";
import {
  otpTemplate,
  welcomeTemplate,
  passwordChangedTemplate,
} from "./emailTemplate.js";

const resendInstance = () => {
  const { RESEND_API_KEY } = process.env;

  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined in environment variables");
  }
  const resend = new Resend(RESEND_API_KEY);

  return resend;
}



export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  return await resendInstance().emails.send({
    from: "GuptKey <noreply@guptkey.work.gd>",
    to,
    subject,
    html,
  });
};

export const sendOTPEmail = async (to: string, otp: string) => {
  return sendEmail(to, "Your GuptKey Verification Code", otpTemplate(otp));
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  return sendEmail(to, "Welcome to GuptKey!", welcomeTemplate(name));
};

export const sendPasswordChangeNotification = async (
  to: string,
  name: string,
  time: string
) => {
  return sendEmail(
    to,
    "Your GuptKey Password Was Changed",
    passwordChangedTemplate(name, time)
  );
};
