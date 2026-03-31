import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import config from "./config";

const auth = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token" });
      }

      const decoded = jwt.verify(
        token,
        config.jwt.secret!
      ) as {
        id: string;
        email: string;
        role: Role;
      };

      //  attach user
      req.user = {
        ...decoded,
        name: "",
        emailVerified: true,
      };

      // role check (SAFE)
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default auth;