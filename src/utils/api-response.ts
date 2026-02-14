import { NextFunction, Request, Response } from "express";

export type ApiResponseBody<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
    error?: unknown;
};

export function sendSuccess<T>(res: Response, message: string, data?: T, statusCode = 200) {
    const body: ApiResponseBody<T> = { success: true, message };
    if (data !== undefined) {
        body.data = data;
    }
    return res.status(statusCode).json(body);
}

export function sendError(res: Response, message: string, statusCode = 500, error?: unknown) {
    const body: ApiResponseBody = { success: false, message };
    if (error !== undefined) {
        body.error = error;
    }
    return res.status(statusCode).json(body);
}

export function responseStandardizer(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json.bind(res);

    res.json = ((body: unknown) => {
        const statusCode = res.statusCode || 200;
        const successByStatus = statusCode < 400;

        if (body && typeof body === "object" && !Array.isArray(body)) {
            const payload = body as Record<string, unknown>;

            if (typeof payload.success === "boolean") {
                const normalized: Record<string, unknown> = { ...payload };
                if (typeof normalized.message !== "string" || normalized.message.length === 0) {
                    normalized.message = normalized.success ? "Request successful" : "Request failed";
                }
                if (!normalized.success && normalized.error === undefined) {
                    normalized.error = normalized.message;
                }
                return originalJson(normalized);
            }

            const wrapped: ApiResponseBody = {
                success: successByStatus,
                message: successByStatus ? "Request successful" : "Request failed",
            };

            if (successByStatus) {
                wrapped.data = payload;
            } else {
                wrapped.error = payload;
            }

            return originalJson(wrapped);
        }

        const wrapped: ApiResponseBody = {
            success: successByStatus,
            message: successByStatus ? "Request successful" : "Request failed",
        };

        if (successByStatus) {
            wrapped.data = body;
        } else {
            wrapped.error = body;
        }

        return originalJson(wrapped);
    }) as Response["json"];

    next();
}
