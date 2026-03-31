import bcrypt from "bcrypt";
import { sendOTP } from "../../utils/email";
import { prisma } from "../../lib/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";

//  Signup (OTP create)
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
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // ⏳ 5 min
        },
      },
    },
  });

  await sendOTP(email, otp);

  return { message: "Check email for OTP" };
};

// 🔐 Verify OTP (⛔ attempts + ⏳ expiry)
export const verifyOTPService = async (payload: any) => {
  const { email, otp } = payload;

  const record = await prisma.emailOtp.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (!record) throw new Error("OTP not found");

  // ⛔ attempt limit
  if (record.attempts >= 3) {
    throw new Error("Too many attempts. Please resend OTP");
  }

  // ⏳ expiry check
  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  // ❌ wrong OTP
  if (record.otp !== otp) {
    await prisma.emailOtp.update({
      where: { id: record.id },
      data: { attempts: record.attempts + 1 },
    });

    throw new Error("Invalid OTP");
  }

  //  success
  await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  await prisma.emailOtp.deleteMany({
    where: { email },
  });

  return { message: "Email verified successfully" };
};

//  Resend OTP
export const resendOTPService = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  if (user.emailVerified) {
    throw new Error("Email already verified");
  }

  //  old OTP delete
  await prisma.emailOtp.deleteMany({ where: { email } });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.emailOtp.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    },
  });

  await sendOTP(email, otp);

  return { message: "OTP resent successfully" };
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