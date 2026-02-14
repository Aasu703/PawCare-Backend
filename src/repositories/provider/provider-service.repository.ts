import { ProviderServiceModel, IProviderService } from "../../models/provider/provider-service.model";
import { ProviderServiceType } from "../../types/provider/provider-service.type";

export class ProviderServiceRepository {
    async createProviderService(data: ProviderServiceType): Promise<IProviderService> {
        return ProviderServiceModel.create(data);
    }

    async getProviderServiceById(id: string): Promise<IProviderService | null> {
        return ProviderServiceModel.findById(id).exec();
    }

    async getProviderServicesByUserId(userId: string): Promise<IProviderService[]> {
        return ProviderServiceModel.find({ userId }).exec();
    }

    async getProviderServiceByUserIdAndType(userId: string, serviceType: string): Promise<IProviderService | null> {
        return ProviderServiceModel.findOne({ userId, serviceType }).exec();
    }

    async getProviderServices(status?: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const filter = status ? { verificationStatus: status } : {};
        const [items, total] = await Promise.all([
            ProviderServiceModel.find(filter).skip(skip).limit(limit).exec(),
            ProviderServiceModel.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async updateProviderServiceById(id: string, updates: Partial<ProviderServiceType>): Promise<IProviderService | null> {
        return ProviderServiceModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async updateProviderServiceStatus(id: string, verificationStatus: "pending" | "approved" | "rejected") {
        return ProviderServiceModel.findByIdAndUpdate(id, { verificationStatus }, { new: true }).exec();
    }
}

export default ProviderServiceRepository;
