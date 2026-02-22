import { ProviderService } from "../../services/provider/provider.service";
import { CreateProviderDTO, LoginProviderDTO } from "../../dtos/provider/provider.dto";
import { Request, Response } from "express";
import z from "zod";

const providerService = new ProviderService();
type ProviderLocationInput = {
    latitude: number;
    longitude: number;
    address?: string;
};

export class ProviderController {
    private sanitizeProvider(provider: Record<string, any>) {
        const plain = typeof provider.toObject === "function" ? provider.toObject() : provider;
        const { password, ...safeProvider } = plain;
        return safeProvider;
    }

    private parseLocation(input: unknown): ProviderLocationInput | null {
        if (!input || typeof input !== "object") return null;

        const locationInput = input as Record<string, unknown>;
        const rawLat = locationInput.latitude ?? locationInput.lat;
        const rawLng = locationInput.longitude ?? locationInput.lng ?? locationInput.lon;

        const latitude = typeof rawLat === "number" ? rawLat : Number.parseFloat(String(rawLat ?? ""));
        const longitude = typeof rawLng === "number" ? rawLng : Number.parseFloat(String(rawLng ?? ""));

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return null;
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return null;
        }

        const addressValue = locationInput.address;
        const address = typeof addressValue === "string" ? addressValue.trim() : "";

        return {
            latitude,
            longitude,
            address,
        };
    }

    async register(req: Request, res: Response) {
        try {
            const parsedData = CreateProviderDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                );
            }
            const providerData: any = parsedData.data;
            const registerProviderType = providerData?.providerType;
            const parsedRegisterLocation = this.parseLocation(providerData?.location);
            if (registerProviderType && ["shop", "vet"].includes(registerProviderType) && !parsedRegisterLocation) {
                return res.status(400).json({
                    success: false,
                    message: "For shop/vet providers, a pinned location is required during signup",
                });
            }
            if (parsedRegisterLocation) {
                providerData.location = parsedRegisterLocation;
            }
            const { token, provider } = await providerService.createProvider(providerData);
            return res.status(201).json(
                { success: true, message: "Provider Created", data: { provider, accessToken: token }, token }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async createProvider(req: Request, res: Response) {
        try {
            const parsedData = CreateProviderDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                );
            }
            const providerData: any = parsedData.data;
            const registerProviderType = providerData?.providerType;
            const parsedRegisterLocation = this.parseLocation(providerData?.location);
            if (registerProviderType && ["shop", "vet"].includes(registerProviderType) && !parsedRegisterLocation) {
                return res.status(400).json({
                    success: false,
                    message: "For shop/vet providers, a pinned location is required during signup",
                });
            }
            if (parsedRegisterLocation) {
                providerData.location = parsedRegisterLocation;
            }
            if (req.file) {
                providerData.imageUrl = `/uploads/${req.file.filename}`;
            }
            const { token, provider } = await providerService.createProvider(providerData);
            return res.status(201).json(
                { success: true, message: "Provider Created", data: { provider, accessToken: token }, token }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async login(req: Request, res: Response) {
        try {
            const parsedData = LoginProviderDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                );
            }
            const loginData: LoginProviderDTO = parsedData.data;
            const { token, provider } = await providerService.loginProvider(loginData);
            return res.status(200).json(
                { success: true, message: "Login successful", data: { provider, accessToken: token }, token }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getProvider(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const provider = await providerService.getProviderById(id);
            return res.status(200).json(
                { success: true, data: provider }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );  
        }
    }

    async getAllProviders(req: Request, res: Response) {
        try {
            const providers = await providerService.getAllProviders();
            return res.status(200).json(
                { success: true, data: providers }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getVerifiedLocations(req: Request, res: Response) {
        try {
            const rawProviderType = `${req.query?.providerType || req.query?.type || ""}`
                .trim()
                .toLowerCase();
            const providerType = rawProviderType === "shop" || rawProviderType === "vet"
                ? rawProviderType
                : undefined;
            const providers = await providerService.getVerifiedProviderLocations(providerType);
            return res.status(200).json({ success: true, data: providers });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async updateProvider(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedProvider = await providerService.updateProvider(id, updates);
            return res.status(200).json(
                { success: true, message: "Provider Updated", data: updatedProvider }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async deleteProvider(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await providerService.deleteProvider(id);
            return res.status(200).json(
                { success: true, message: "Provider Deleted" }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async setProviderType(req: Request, res: Response) {
        try {
            const providerId = (req as any).provider?._id || req.params.id;
            const providerType = req.body?.providerType ?? req.body?.type;
            if (!providerType || !["shop", "vet", "babysitter"].includes(providerType)) {
                return res.status(400).json({ success: false, message: "Invalid provider type. Must be shop, vet, or babysitter" });
            }

            const certification = (req.body?.certification || "").trim();
            const certificationDocumentUrl = (req.body?.certificationDocumentUrl || "").trim();
            const experience = (req.body?.experience || "").trim();
            const clinicOrShopName = (req.body?.clinicOrShopName || "").trim();
            const panNumber = (req.body?.panNumber || "").trim().toUpperCase();
            const locationInput =
                req.body?.location ??
                {
                    latitude: req.body?.latitude,
                    longitude: req.body?.longitude,
                    address: req.body?.locationAddress,
                };
            const parsedLocation = this.parseLocation(locationInput);

            if (providerType === "vet") {
                if (!certification || !experience || !clinicOrShopName) {
                    return res.status(400).json({
                        success: false,
                        message: "For vet providers, certification, experience, and clinic/shop name are required",
                    });
                }
                if (!parsedLocation) {
                    return res.status(400).json({
                        success: false,
                        message: "For vet providers, a pinned clinic location is required",
                    });
                }
            }

            // "babysitter" is used as the groomer flow in the frontend.
            if (providerType === "babysitter") {
                if (!experience) {
                    return res.status(400).json({
                        success: false,
                        message: "For groomer providers, experience is required",
                    });
                }
            }

            if (providerType === "shop") {
                if (!clinicOrShopName || !panNumber) {
                    return res.status(400).json({
                        success: false,
                        message: "For shop providers, shop name and PAN number are required",
                    });
                }
                if (!parsedLocation) {
                    return res.status(400).json({
                        success: false,
                        message: "For shop providers, a pinned shop location is required",
                    });
                }
            }

            const provider = await providerService.setProviderType(providerId, {
                providerType,
                certification,
                certificationDocumentUrl,
                experience,
                clinicOrShopName,
                panNumber,
                location: parsedLocation || undefined,
            });
            return res.status(200).json({ success: true, message: "Provider details submitted for admin verification", data: this.sanitizeProvider(provider as any) });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getMyProfile(req: Request, res: Response) {
        try {
            const providerId = (req as any).provider?._id;
            if (!providerId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const provider = await providerService.getProviderProfile(providerId);
            return res.status(200).json({ success: true, data: this.sanitizeProvider(provider as any) });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async updateMyProfile(req: Request, res: Response) {
        try {
            const providerId = (req as any).provider?._id;
            if (!providerId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const updates: Record<string, any> = {};
            const currentProvider = await providerService.getProviderProfile(providerId);
            const allowedFields = [
                "businessName",
                "address",
                "phone",
                "email",
                "certification",
                "certificationDocumentUrl",
                "experience",
                "clinicOrShopName",
                "panNumber",
            ];

            for (const field of allowedFields) {
                if (typeof req.body?.[field] === "string") {
                    updates[field] = req.body[field].trim();
                }
            }

            if (updates.panNumber) {
                updates.panNumber = updates.panNumber.toUpperCase();
            }

            const hasLocationPayload =
                req.body?.location !== undefined ||
                req.body?.latitude !== undefined ||
                req.body?.longitude !== undefined;

            if (hasLocationPayload) {
                const locationInput =
                    req.body?.location ??
                    {
                        latitude: req.body?.latitude,
                        longitude: req.body?.longitude,
                        address: req.body?.locationAddress,
                    };
                const parsedLocation = this.parseLocation(locationInput);
                if (!parsedLocation) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid location payload. Please pin a valid location on map",
                    });
                }

                updates.location = parsedLocation;
                updates.locationUpdatedAt = new Date();

                if (["shop", "vet"].includes((currentProvider as any).providerType || "")) {
                    updates.locationVerified = false;
                    updates.locationVerifiedAt = null;
                    updates.locationVerifiedBy = null;
                    updates.pawcareVerified = false;
                    updates.status = "pending";
                }
            }

            const provider = await providerService.updateProviderProfile(providerId, updates);
            return res.status(200).json({
                success: true,
                message: updates.status === "pending"
                    ? "Provider profile updated. Location is pending admin verification"
                    : "Provider profile updated",
                data: this.sanitizeProvider(provider as any),
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async approveProvider(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const adminId = ((req.user as any)?._id || (req.user as any)?.id || "").toString();
            const provider = await providerService.approveProvider(id, adminId || undefined);
            const safeProvider = this.sanitizeProvider(provider as any);
            const message = (safeProvider as any)?.pawcareVerified
                ? "Provider approved and marked as PawCare verified"
                : "Provider approved";
            return res.status(200).json({ success: true, message, data: safeProvider });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async rejectProvider(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const provider = await providerService.rejectProvider(id);
            return res.status(200).json({ success: true, message: "Provider rejected", data: this.sanitizeProvider(provider as any) });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getProvidersByStatus(req: Request, res: Response) {
        try {
            const { status } = req.params;
            const providers = await providerService.getProvidersByStatus(status);
            return res.status(200).json({ success: true, data: providers });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}
