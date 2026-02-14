import { ProviderService } from "../../services/provider/provider.service";
import { CreateProviderDTO, LoginProviderDTO } from "../../dtos/provider/provider.dto";
import { Request, Response } from "express";
import z from "zod";

const providerService = new ProviderService();

export class ProviderController {
    async register(req: Request, res: Response) {
        try {
            const parsedData = CreateProviderDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                );
            }
            const providerData: any = parsedData.data;
            const newProvider = await providerService.createProvider(providerData);
            return res.status(201).json(
                { success: true, message: "Provider Created", data: newProvider }
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
            if (req.file) {
                providerData.imageUrl = `/uploads/${req.file.filename}`;
            }
            const newProvider = await providerService.createProvider(providerData);
            return res.status(201).json(
                { success: true, message: "Provider Created", data: newProvider }
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
            const { providerType } = req.body;
            if (!["shop", "vet", "babysitter"].includes(providerType)) {
                return res.status(400).json({ success: false, message: "Invalid provider type. Must be shop, vet, or babysitter" });
            }
            const provider = await providerService.setProviderType(providerId, providerType);
            return res.status(200).json({ success: true, message: "Provider type set", data: provider });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async approveProvider(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const provider = await providerService.approveProvider(id);
            return res.status(200).json({ success: true, message: "Provider approved", data: provider });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async rejectProvider(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const provider = await providerService.rejectProvider(id);
            return res.status(200).json({ success: true, message: "Provider rejected", data: provider });
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
