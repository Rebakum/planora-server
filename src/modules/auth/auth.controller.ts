import { Request, Response } from "express";
import * as AuthService from "./auth.service";

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.signupUser(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};