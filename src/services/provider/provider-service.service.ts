import { ProviderServiceRepository } from "../../repositories/provider/provider-service.repository";
import { ProviderServiceType } from "../../types/provider/provider-service.type";
import { HttpError } from "../../errors/http-error";

const providerServiceRepository = new ProviderServiceRepository();

export class ProviderServiceService {
    async applyForService(userId: string, data: Omit<ProviderServiceType, "userId" | "verificationStatus" | "ratingAverage" | "ratingCount" | "earnings">) {
        if (!userId) throw new HttpError(400, "User ID is required");

        const existing = await providerServiceRepository.getProviderServiceByUserIdAndType(userId, data.serviceType);
        if (existing && existing.verificationStatus !== "rejected") {
            throw new HttpError(409, "Service application already exists for this service type");
        }

        if (existing && existing.verificationStatus === "rejected") {
            const updated = await providerServiceRepository.updateProviderServiceById(existing.id, {
                ...data,
                verificationStatus: "pending",
            } as ProviderServiceType);
            if (!updated) throw new HttpError(404, "Provider service not found");
            return updated;
        }

        return providerServiceRepository.createProviderService({
            ...data,
            userId,
            verificationStatus: "pending",
            ratingAverage: 0,
            ratingCount: 0,
            earnings: 0,
        } as ProviderServiceType);
    }

    async getProviderServiceById(id: string) {
        const service = await providerServiceRepository.getProviderServiceById(id);
        if (!service) throw new HttpError(404, "Provider service not found");
        return service;
    }

    async listProviderServicesByUser(userId: string) {
        return providerServiceRepository.getProviderServicesByUserId(userId);
    }

    async listProviderServices(status?: string, page = 1, limit = 20) {
        return providerServiceRepository.getProviderServices(status, page, limit);
    }

    async updateProviderServiceStatus(id: string, status: "pending" | "approved" | "rejected") {
        const updated = await providerServiceRepository.updateProviderServiceStatus(id, status);
        if (!updated) throw new HttpError(404, "Provider service not found");
        return updated;
    }

    async getApprovedServiceForUser(userId: string, serviceType: string) {
        const service = await providerServiceRepository.getProviderServiceByUserIdAndType(userId, serviceType);
        if (!service || service.verificationStatus !== "approved") return null;
        return service;
    }

    async updateRatingForService(providerServiceId: string, rating: number) {
        const service = await providerServiceRepository.getProviderServiceById(providerServiceId);
        if (!service) throw new HttpError(404, "Provider service not found");
        const currentCount = service.ratingCount ?? 0;
        const currentAvg = service.ratingAverage ?? 0;
        const nextCount = currentCount + 1;
        const nextAvg = Math.round(((currentAvg * currentCount + rating) / nextCount) * 10) / 10;
        return providerServiceRepository.updateProviderServiceById(providerServiceId, {
            ratingAverage: nextAvg,
            ratingCount: nextCount,
        } as ProviderServiceType);
    }
}

export default ProviderServiceService;
