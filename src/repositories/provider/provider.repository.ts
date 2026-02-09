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
        });
        return provider;
    }

    async getProviderByEmail(email: string): Promise<IProvider | null> {
        return ProviderModel.findOne({ email }).exec();
    }

    async getProviderById(id: string): Promise<IProvider | null> {
        return ProviderModel.findById(id).exec();
    }

    async updateProviderById(id: string, updates: Partial<Pick<IProvider, "businessName" | "address" | "phone" | "email" | "password">>): Promise<IProvider | null> {
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
}
