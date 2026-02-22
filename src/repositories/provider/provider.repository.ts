import { ProviderModel, IProvider } from "../../models/provider/provider.model";
import { CreateProviderDTO } from "../../dtos/provider/provider.dto";

export class ProviderRepository {
    async createProvider(data: CreateProviderDTO): Promise<IProvider> {
        const provider = await ProviderModel.create({
            businessName: data.businessName,
            address: data.address,
            phone: data.phone,
            email: data.email,
            password: data.password,
            providerType: (data as any).providerType || null,
            location: (data as any).location || undefined,
            locationUpdatedAt: (data as any).location ? new Date() : null,
            locationVerified: false,
            pawcareVerified: false,
            status: "pending",
        });
        return provider;
    }

    async getProviderByEmail(email: string): Promise<IProvider | null> {
        return ProviderModel.findOne({ email }).exec();
    }

    async getProviderById(id: string): Promise<IProvider | null> {
        return ProviderModel.findById(id).exec();
    }

    async updateProviderById(id: string, updates: Partial<IProvider>): Promise<IProvider | null> {
        return ProviderModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteProviderById(id: string): Promise<IProvider | null> {
        return ProviderModel.findByIdAndDelete(id).exec();
    }

    async getAllProviders(): Promise<IProvider[]> {
        return ProviderModel.find().exec();
    }

    async getProviderByUserId(userId: string): Promise<IProvider | null> {
        return ProviderModel.findOne({ userId }).exec();
    }

    async getProvidersByType(providerType: string): Promise<IProvider[]> {
        return ProviderModel.find({ providerType, status: "approved" }).exec();
    }

    async getProvidersByStatus(status: string): Promise<IProvider[]> {
        return ProviderModel.find({ status }).exec();
    }

    async getVerifiedProvidersWithLocation(providerType?: "shop" | "vet") {
        const filter: Record<string, unknown> = {
            status: "approved",
            pawcareVerified: true,
            locationVerified: true,
            "location.latitude": { $exists: true },
            "location.longitude": { $exists: true },
        };

        if (providerType) {
            filter.providerType = providerType;
        }

        return ProviderModel.find(filter)
            .select(
                "_id businessName clinicOrShopName providerType address rating location locationVerified pawcareVerified"
            )
            .sort({ locationUpdatedAt: -1, createdAt: -1, _id: -1 })
            .lean()
            .exec();
    }
}
