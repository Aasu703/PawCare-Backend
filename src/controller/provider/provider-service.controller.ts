import { Request, Response } from "express";
import ProviderServiceService from "../../services/provider/provider-service.service";
import { ApplyProviderServiceDto } from "../../dtos/provider/provider-service.dto";
import z from "zod";

const formatZodError = (err: z.ZodError) =>
    err.issues.map(i => `${i.path && i.path.length ? i.path.join('.') : 'value'}: ${i.message}`).join('; ');

const providerServiceService = new ProviderServiceService();

const collectDocumentPaths = (files: Record<string, Express.Multer.File[]> | undefined) => {
    if (!files) return [];
    const paths: string[] = [];
    Object.values(files).forEach((fileList) => {
        fileList.forEach((file) => {
            paths.push(`/uploads/${file.filename}`);
        });
    });
    return paths;
};

export class ProviderServiceApplicationController {
    async apply(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.userId || (req.user as any)?._id?.toString();
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const parsed = ApplyProviderServiceDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: formatZodError(parsed.error) });
            }

            const files = req.files as Record<string, Express.Multer.File[]> | undefined;
            const documents = collectDocumentPaths(files);
            const parsedDocuments = parsed.data.documents
                ? Array.isArray(parsed.data.documents)
                    ? parsed.data.documents
                    : [parsed.data.documents]
                : [];
            const payload = {
                ...parsed.data,
                documents: parsedDocuments.length > 0
                    ? [...documents, ...parsedDocuments]
                    : documents,
            };

            const serviceType = parsed.data.serviceType;
            const hasFile = (field: string) => (files?.[field]?.length ?? 0) > 0;

            if (serviceType === "vet") {
                if (!hasFile("medicalLicenseDocument")) {
                    return res.status(400).json({ success: false, message: "medicalLicenseDocument is required" });
                }
                if (!payload.registrationNumber) {
                    return res.status(400).json({ success: false, message: "registrationNumber is required" });
                }
            }

            if (serviceType === "groomer") {
                if (!hasFile("certificationDocument")) {
                    return res.status(400).json({ success: false, message: "certificationDocument is required" });
                }
            }

            if (serviceType === "boarding") {
                if (!hasFile("facilityImages")) {
                    return res.status(400).json({ success: false, message: "facilityImages are required" });
                }
            }

            if (serviceType === "shop_owner") {
                if (!hasFile("businessRegistrationDocument")) {
                    return res.status(400).json({ success: false, message: "businessRegistrationDocument is required" });
                }
            }

            const created = await providerServiceService.applyForService(userId, payload as any);
            return res.status(201).json({ success: true, message: "Service application submitted", data: created });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async listMine(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.userId || (req.user as any)?._id?.toString();
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const services = await providerServiceService.listProviderServicesByUser(userId);
            return res.status(200).json({ success: true, data: services });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const service = await providerServiceService.getProviderServiceById(req.params.id);
            return res.status(200).json({ success: true, data: service });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default new ProviderServiceApplicationController();
