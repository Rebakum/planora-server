import bcrypt from "bcrypt";
import { sendOTP } from "../../utils/email";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export const signupService = async (payload: any) => {
  const { email, password, name } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    name,
    role: "USER",

    emailOtps: {
      create: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    },
  },
});

  await sendOTP(email, otp);

  return { message: "Check email for OTP" };
};

export const verifyOTPService = async (payload: any) => {
  const { email, otp } = payload;

  const record = await prisma.emailOtp.findFirst({
    where: {
      email,
      otp,
    },
  });

  if (!record) {
    throw new Error("Invalid OTP");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  await prisma.user.update({
    where: { email },
    data: {
      emailVerified: true,
    },
  });

  await prisma.emailOtp.deleteMany({
    where: { email },
  });

  return { message: "Email verified" };
};

export const loginService = async (payload: any, req: any) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.emailVerified) throw new Error("Email not verified");
 

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
   if (! accessToken || !refreshToken) {
  throw new Error("JWT secrets missing in .env");
}

  await prisma.session.create({
    data: {
      id: crypto.randomUUID(),
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    },
  });

  return { user, accessToken, refreshToken };
};

export const refreshTokenService = async (oldToken: string) => {
  const decoded: any = verifyRefreshToken(oldToken);

  const session = await prisma.session.findUnique({
    where: { token: oldToken },
  });

 if (!session) {
  await prisma.session.deleteMany({ where: { userId: decoded.id } });
  throw new Error("Token reuse detected. All sessions killed.");
}

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) throw new Error("User not found");

  // 🔥 generate NEW tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  //  save NEW session
  await prisma.session.create({
    data: {
      id: crypto.randomUUID(),
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
export const getMySessionsService = async (userId: string) => {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return sessions;
};

export const logoutAllService = async (userId: string) => {
  await prisma.session.deleteMany({
    where: { userId },
  });
};