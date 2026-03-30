import { z } from "zod";

 const signupSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z
  .string()
  .email("Invalid email format")
  .refine((email) => {
    const domain = email.split("@")[1];

    // must contain dot (basic real domain check)
    return domain.includes(".");
  }, "Email must be from a real domain"),
  password: z.string().min(6, "Password must be 6+ chars"),
});

 const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

 const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});
export  const authValidation = {
   signupSchema,
   loginSchema,
  otpSchema,
};