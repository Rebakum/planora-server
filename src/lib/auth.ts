import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: ["http://localhost:3000"],

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user" },
      phone: { type: "string", required: false },
      status: { type: "string", defaultValue: "active" },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // ❗ signup এর পর login হবে না
    requireEmailVerification: true, // ❗ verify না করলে login blocked
  },

  emailVerification: {
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, url }) => {
      await transporter.sendMail({
        from: '"Planora" <no-reply@planora.com>',
        to: user.email,
        subject: "Verify your email",

        html: `
          <h2>Hello ${user.name || "User"}</h2>
          <p>Click below to verify:</p>

          <a href="${url}" style="padding:10px 20px;background:#4f46e5;color:white;text-decoration:none;">
            Verify Email
          </a>

          <p>${url}</p>
        `,
      });
    },
  },
});