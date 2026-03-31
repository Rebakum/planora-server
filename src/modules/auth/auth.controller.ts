import { Request, Response } from "express";

import {
  loginService,
  refreshTokenService,
  signupService,
  verifyOTPService,
  getMySessionsService,
  logoutAllService,
  resendOTPService,
} from "./auth.service";


export const signup = async (req: Request, res: Response) => {
  try {
    const result = await signupService(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const result = await verifyOTPService(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await resendOTPService(email);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body, req);

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      user: result.user,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const refreshTokenController = async (req: any, res: any) => {
  try {
    const oldToken = req.cookies.refreshToken;

    if (!oldToken) throw new Error("No token");

    const result = await refreshTokenService(oldToken);

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ message: "Token rotated" });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const getMySessions = async (req: any, res: any) => {
  try {
    const userId = req.user!.id;

    const sessions = await getMySessionsService(userId);

    res.json({ sessions });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const logoutAllDevices = async (req: any, res: Response) => {
  try {
    const userId = req.user!.id;

    await logoutAllService(userId);

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};