import { CreateProviderDTO, LoginProviderDTO } from "../../dtos/provider/provider.dto";
import bcryptjs from "bcryptjs";
import { HttpError } from "../../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { ProviderRepository } from "../../repositories/provider/provider.repository";

const providerRepository = new ProviderRepository();

export class ProviderService {
    async createProvider(data: CreateProviderDTO) {
        const emailCheck = await providerRepository.getProviderByEmail(data.email);
        if (emailCheck) {
            throw new HttpError(403, "Email is already in use");
        }

        const hashedPassword = await bcryptjs.hash(data.password, 10);
        data.password = hashedPassword;

        const newProvider = await providerRepository.createProvider(data);
        return newProvider;
    }

    async loginProvider(data: LoginProviderDTO) {
        const provider = await providerRepository.getProviderByEmail(data.email);
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }

        const validPassword = await bcryptjs.compare(data.password, provider.password);
        if (!validPassword) {
            throw new HttpError(401, "Invalid credentials");
        }

        const payload = {
            id: provider._id,
            email: provider.email,
            businessName: provider.businessName,
            role: provider.role || "provider",
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
        return { token, provider };
    }

    async getProviderById(id: string) {
        const provider = await providerRepository.getProviderById(id);
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }

    async getAllProviders() {
        return providerRepository.getAllProviders();
    }

    async updateProvider(id: string, updates: Partial<{ businessName: string; address: string; phone: string; email: string }>) {
        const provider = await providerRepository.updateProviderById(id, updates);
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }

    async deleteProvider(id: string) {
        const provider = await providerRepository.deleteProviderById(id);
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }
}
