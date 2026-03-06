import { ProviderServiceRepository } from "../../repositories/provider/provider-service.repository";
import { ProviderServiceType } from "../../types/provider/provider-service.type";
import { HttpError } from "../../errors/http-error";

export class ProviderServiceService {
    constructor(private providerServiceRepository = new ProviderServiceRepository()) {}

    // Service for managing provider services (e.g. shop, vet, babysitter applications)
    async applyForService(userId: string, data: Omit<ProviderServiceType, "userId" | "verificationStatus" | "ratingAverage" | "ratingCount" | "earnings">) {
        if (!userId) throw new HttpError(400, "User ID is required");

        const existing = await this.providerServiceRepository.getProviderServiceByUserIdAndType(userId, data.serviceType);
        if (existing && existing.verificationStatus !== "rejected") {
            throw new HttpError(409, "Service application already exists for this service type");
        } // Allow re-application if previous was rejected

        if (existing && existing.verificationStatus === "rejected") {
            const updated = await this.providerServiceRepository.updateProviderServiceById(existing.id, {
                ...data,
                verificationStatus: "pending",
            } as ProviderServiceType);
            if (!updated) throw new HttpError(404, "Provider service not found");
            return updated;
        } // If re-applying after rejection, update existing record instead of creating new one

        return this.providerServiceRepository.createProviderService({
            ...data,
            userId,
            verificationStatus: "pending",
            ratingAverage: 0,
            ratingCount: 0,
            earnings: 0,
        } as ProviderServiceType);
    }

    async getProviderServiceById(id: string) {
        // Get a provider service application by its ID
        const service = await this.providerServiceRepository.getProviderServiceById(id);
        if (!service) throw new HttpError(404, "Provider service not found");
        return service;
    }

    async listProviderServicesByUser(userId: string) {
        // List all provider service applications for a specific userq
        return this.providerServiceRepository.getProviderServicesByUserId(userId);
    }

    async listProviderServices(status?: string, page = 1, limit = 20) {
        // List provider services with optional filtering by verification status and pagination
        return this.providerServiceRepository.getProviderServices(status, page, limit);
    }

    async updateProviderServiceStatus(id: string, status: "pending" | "approved" | "rejected") {
        // Update the verification status of a provider service application (admin action)
        const updated = await this.providerServiceRepository.updateProviderServiceStatus(id, status);
        if (!updated) throw new HttpError(404, "Provider service not found");
        return updated;
    }

    async getApprovedServiceForUser(userId: string, serviceType: string) {
        // Get the approved provider service of a specific type for a user (used in authorization middleware)
        const service = await this.providerServiceRepository.getProviderServiceByUserIdAndType(userId, serviceType);
        if (!service || service.verificationStatus !== "approved") return null;
        return service;
    }

    async updateRatingForService(providerServiceId: string, rating: number) {
        // Update the average rating and rating count for a provider service when a new review is submitted
        const service = await this.providerServiceRepository.getProviderServiceById(providerServiceId);
        if (!service) throw new HttpError(404, "Provider service not found");
        const currentCount = service.ratingCount ?? 0;
        const currentAvg = service.ratingAverage ?? 0;
        const nextCount = currentCount + 1;
        const nextAvg = Math.round(((currentAvg * currentCount + rating) / nextCount) * 10) / 10;
        return this.providerServiceRepository.updateProviderServiceById(providerServiceId, {
            ratingAverage: nextAvg,
            ratingCount: nextCount,
        } as ProviderServiceType);
    }
}

export default ProviderServiceService;
