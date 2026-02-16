import { NextFunction, Request, Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

function write(level: "info" | "warn" | "error", message: string, payload?: Record<string, unknown>) {
    const entry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        ...(payload ?? {}),
    };

    if (level === "error") {
        console.error(JSON.stringify(entry));
        return;
    }

    if (!isProduction || level !== "info") {
        console.log(JSON.stringify(entry));
    }
}

export const logger = {
    info: (message: string, payload?: Record<string, unknown>) => write("info", message, payload),
    warn: (message: string, payload?: Record<string, unknown>) => write("warn", message, payload),
    error: (message: string, payload?: Record<string, unknown>) => write("error", message, payload),
};

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();

    res.on("finish", () => {
        const durationMs = Date.now() - startedAt;
        logger.info("http_request", {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs,
            ip: req.ip,
        });
    });

    next();
}
