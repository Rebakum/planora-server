import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "./config";

export enum UserRole {
  user = "USER",
  admin = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          message: "No token",
        });
      }

      const decoded = jwt.verify(token, config.jwt.secret);

      req.user = decoded;

      // role check
      if (roles.length && !roles.includes((decoded as any).role)) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  };
};

export default auth;