import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

const resendOtpSchema = z.object({
  email: z.string().email(),
});

export const authValidation = {
  signupSchema,
  loginSchema,
  otpSchema,
  resendOtpSchema,
};