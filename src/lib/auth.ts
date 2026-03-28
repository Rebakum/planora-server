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
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,

  sendVerificationEmail: async ({ user, url, token }) => {
  try {
    await transporter.sendMail({
      from: '"Prisma Blog" <prismablog@ph.com>',
      to: user.email,
      subject: "Please verify your email",

      html: `
        <h2>Hello ${user.name || "there"}</h2>

        <p>Please verify your email:</p>

        <a href="${url}" style="padding:10px 20px;background:#4f46e5;color:white;text-decoration:none;">
          Verify Email
        </a>

        <p>${url}</p>
      `,
    });

    // ❌ কিছু return করবে না
  } catch (error) {
    console.error(error);
    throw error;
  }
},
  },
});