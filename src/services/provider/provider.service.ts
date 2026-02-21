import { CreateProviderDTO, LoginProviderDTO } from "../../dtos/provider/provider.dto";
import bcryptjs from "bcryptjs";
import { HttpError } from "../../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_EXPIRES_IN, JWT_SECRET } from "../../config";
import { ProviderRepository } from "../../repositories/provider/provider.repository";

const providerRepository = new ProviderRepository();
type ProviderKind = "shop" | "vet" | "babysitter";
type ProviderLocationInput = {
    latitude: number;
    longitude: number;
    address?: string;
};

export class ProviderService {
    private sanitizeProvider(provider: Record<string, any>) {
        const plain = typeof provider.toObject === "function" ? provider.toObject() : provider;
        const { password, ...safeProvider } = plain;
        return safeProvider;
    }

    private requiresLocationVerification(providerType?: string | null) {
        return providerType === "shop" || providerType === "vet";
    }

    private hasPinnedLocation(provider: Record<string, any>) {
        const lat = Number(provider?.location?.latitude);
        const lng = Number(provider?.location?.longitude);
        return Number.isFinite(lat) && Number.isFinite(lng);
    }

    async createProvider(data: CreateProviderDTO) {
        const emailCheck = await providerRepository.getProviderByEmail(data.email);
        if (emailCheck) {
            throw new HttpError(403, "Email is already in use");
        }

        const hashedPassword = await bcryptjs.hash(data.password, 10);
        data.password = hashedPassword;

        const newProvider = await providerRepository.createProvider(data);
        
        // Generate token for the newly registered provider
        const payload = {
            id: newProvider._id,
            email: newProvider.email,
            businessName: newProvider.businessName,
            role: newProvider.role || "provider",
            providerType: newProvider.providerType || null,
            status: newProvider.status || "pending",
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
        return { token, provider: this.sanitizeProvider(newProvider as unknown as Record<string, any>) };
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

    async setProviderType(
        id: string,
        payload: {
            providerType: ProviderKind;
            certification?: string;
            certificationDocumentUrl?: string;
            experience?: string;
            clinicOrShopName?: string;
            panNumber?: string;
            location?: ProviderLocationInput;
        }
    ) {
        const {
            providerType,
            certification,
            certificationDocumentUrl,
            experience,
            clinicOrShopName,
            panNumber,
            location
        } = payload;
        const updates: Record<string, any> = {
            providerType,
            status: "pending",
            certification: certification || "",
            certificationDocumentUrl: certificationDocumentUrl || "",
            experience: experience || "",
            clinicOrShopName: clinicOrShopName || "",
            panNumber: panNumber || "",
        };

        if (location) {
            updates.location = {
                latitude: location.latitude,
                longitude: location.longitude,
                address: location.address || "",
            };
            updates.locationUpdatedAt = new Date();
        }

        if (this.requiresLocationVerification(providerType)) {
            updates.locationVerified = false;
            updates.locationVerifiedAt = null;
            updates.locationVerifiedBy = null;
            updates.pawcareVerified = false;
        } else {
            updates.locationVerified = false;
            updates.locationVerifiedAt = null;
            updates.locationVerifiedBy = null;
            updates.pawcareVerified = false;
        }

        const provider = await providerRepository.updateProviderById(id, updates);
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }

    async getProviderProfile(id: string) {
        const provider = await providerRepository.getProviderById(id);
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }

    async updateProviderProfile(id: string, updates: Record<string, any>) {
        const provider = await providerRepository.updateProviderById(id, updates);
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }

    async approveProvider(id: string, adminId?: string) {
        const current = await providerRepository.getProviderById(id);
        if (!current) {
            throw new HttpError(404, "Provider not found");
        }

        const shouldVerifyLocation = this.requiresLocationVerification(current.providerType);
        if (shouldVerifyLocation && !this.hasPinnedLocation(current as unknown as Record<string, any>)) {
            throw new HttpError(
                400,
                "Pinned map location is required before approving a shop or vet provider"
            );
        }

        const updates: Record<string, any> = {
            status: "approved",
        };

        if (shouldVerifyLocation) {
            updates.locationVerified = true;
            updates.locationVerifiedAt = new Date();
            updates.locationVerifiedBy = adminId || null;
            updates.pawcareVerified = true;
        } else {
            updates.locationVerified = false;
            updates.locationVerifiedAt = null;
            updates.locationVerifiedBy = null;
            updates.pawcareVerified = false;
        }

        const provider = await providerRepository.updateProviderById(id, updates);
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
        return provider;
    }

    async rejectProvider(id: string) {
        const provider = await providerRepository.updateProviderById(id, {
            status: "rejected",
            locationVerified: false,
            locationVerifiedAt: null,
            locationVerifiedBy: null,
            pawcareVerified: false,
        });
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
