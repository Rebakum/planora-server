import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  user = "user",
  admin = "admin",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        emailVerified: boolean;
      };
    }
  }
}

//middle ware
const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // optional (better UX)
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email first",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user.role as UserRole) || UserRole.user,
        emailVerified: session.user.emailVerified,
      };

      // 🔥 ROLE CHECK
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  };
};
export default auth;
