import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { HttpError } from "../errors/http-error";

export function validateBody(schema: ZodType<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      return next();
    } catch (err: any) {
      return next(new HttpError(400, "Validation failed", err?.errors || err?.message));
    }
  };
}
