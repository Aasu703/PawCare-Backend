import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";
import ProviderServiceService from "../services/provider/provider-service.service";

const providerServiceService = new ProviderServiceService();

const getUserId = (req: Request) =>
    (req.user as any)?.userId || (req.user as any)?._id?.toString();

export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user as any;
            if (!user) throw new HttpError(401, "Unauthorized");
            if (user.role !== role) throw new HttpError(403, "Forbidden");
            return next();
        } catch (err: any) {
            return res.status(err.statusCode || 403).json({ success: false, message: err.message || "Forbidden" });
        }
    };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    return requireRole("admin")(req, res, next);
}

export function requireVerifiedService(serviceType: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getUserId(req);
            if (!userId) throw new HttpError(401, "Unauthorized");
            const service = await providerServiceService.getApprovedServiceForUser(userId, serviceType);
            if (!service) throw new HttpError(403, "Service not verified");
            return next();
        } catch (err: any) {
            return res.status(err.statusCode || 403).json({ success: false, message: err.message || "Forbidden" });
        }
    };
}

export function requireServiceOwnership(paramName: string = "id") {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getUserId(req);
            if (!userId) throw new HttpError(401, "Unauthorized");
            const serviceId = req.params[paramName];
            if (!serviceId) throw new HttpError(400, "Service ID is required");
            const service = await providerServiceService.getProviderServiceById(serviceId);
            if (service.userId?.toString() !== userId.toString()) {
                throw new HttpError(403, "Forbidden: not your service application");
            }
            return next();
        } catch (err: any) {
            return res.status(err.statusCode || 403).json({ success: false, message: err.message || "Forbidden" });
        }
    };
}
