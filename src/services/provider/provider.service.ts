import { CreateProviderDTO, LoginProviderDTO } from "../../dtos/provider/provider.dto";
import bcryptjs from "bcryptjs";
import { HttpError } from "../../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_EXPIRES_IN, JWT_SECRET } from "../../config";
import { ProviderRepository } from "../../repositories/provider/provider.repository";

const providerRepository = new ProviderRepository();

export class ProviderService {
    private sanitizeProvider(provider: Record<string, any>) {
        const plain = typeof provider.toObject === "function" ? provider.toObject() : provider;
        const { password, ...safeProvider } = plain;
        return safeProvider;
    }

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
            providerType: provider.providerType || null,
            status: provider.status || "pending",
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
        return { token, provider: this.sanitizeProvider(provider as unknown as Record<string, any>) };
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

    async updateProvider(id: string, updates: Record<string, any>) {
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

    async setProviderType(id: string, providerType: "shop" | "vet" | "babysitter") {
        const provider = await providerRepository.updateProviderById(id, { providerType });
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }

    async approveProvider(id: string) {
        const provider = await providerRepository.updateProviderById(id, { status: "approved" });
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }

    async rejectProvider(id: string) {
        const provider = await providerRepository.updateProviderById(id, { status: "rejected" });
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }

    async getProvidersByType(providerType: string) {
        return providerRepository.getProvidersByType(providerType);
    }

    async getProvidersByStatus(status: string) {
        return providerRepository.getProvidersByStatus(status);
    }
}
