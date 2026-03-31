import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error?.message || "Validation error",
        errors: result.error,
      });
    }

    req.body = result.data; 
    next();
  };