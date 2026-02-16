import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { HttpError } from "../errors/http-error";
import { sendError } from "../utils/api-response";

export function notFoundHandler(req: Request, res: Response) {
    return sendError(res, "Route not found", 404, { path: req.originalUrl, method: req.method });
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof HttpError) {
        return sendError(res, err.message || "Bad Request", err.statusCode || 400, err.error);
    }

    if (err instanceof ZodError) {
        return sendError(res, "Validation failed", 400, err.flatten());
    }

    if (err instanceof multer.MulterError) {
        return sendError(res, err.message || "File upload error", 400, { code: err.code });
    }

    if (err instanceof Error) {
        return sendError(res, err.message || "Internal Server Error", 500);
    }

    return sendError(res, "Internal Server Error", 500);
}
