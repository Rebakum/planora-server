import { Role } from "@prisma/client";
import { UserRole } from "../middlewares/auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
        emailVerified: boolean;
      };
    }
  }
}

export {};