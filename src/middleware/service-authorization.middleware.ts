import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";
import ProviderServiceService from "../services/provider/provider-service.service";

const providerServiceService = new ProviderServiceService(); // Import the service to check provider services

const getUserId = (req: Request) =>
    (req.user as any)?.userId || (req.user as any)?._id?.toString(); // Helper to get user ID from request

export function requireRole(role: string) {
    // Middleware to require a specific user role (e.g. "admin", "provider")
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
} // Middleware to require admin role

export function requireVerifiedService(serviceType: string) {
    // Middleware to require that the user has an approved provider service of a specific type (e.g. "shop", "vet", "babysitter")
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
    // Middleware to require that the user owns the provider service application they are trying to access (used for provider service management routes)
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

export function requireProviderType(providerType: "shop" | "vet" | "babysitter") {
    // Middleware to require that the user has an approved provider service of a specific type to access certain routes (e.g. only approved vets can access vet-related routes)
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const provider = (req as any).provider;
            if (!provider) throw new HttpError(401, "Unauthorized");
            if (provider.status !== "approved") {
                throw new HttpError(403, "Provider not approved");
            }
            if (provider.providerType !== providerType) {
                throw new HttpError(403, `Only ${providerType} providers can access this resource`);
            }
            return next();
        } catch (err: any) {
            return res.status(err.statusCode || 403).json({ success: false, message: err.message || "Forbidden" });
        }
    };
}
