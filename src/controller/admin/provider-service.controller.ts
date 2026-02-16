import { Request, Response } from "express";
import ProviderServiceService from "../../services/provider/provider-service.service";

const providerServiceService = new ProviderServiceService();

export class AdminProviderServiceController {
    async list(req: Request, res: Response) {
        try {
            const status = req.query.status as string | undefined;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await providerServiceService.listProviderServices(status, page, limit);
            return res.status(200).json({ success: true, data: result });
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

    async approve(req: Request, res: Response) {
        try {
            const updated = await providerServiceService.updateProviderServiceStatus(req.params.id, "approved");
            return res.status(200).json({ success: true, message: "Provider service approved", data: updated });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async reject(req: Request, res: Response) {
        try {
            const updated = await providerServiceService.updateProviderServiceStatus(req.params.id, "rejected");
            return res.status(200).json({ success: true, message: "Provider service rejected", data: updated });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async suspend(req: Request, res: Response) {
        try {
            const updated = await providerServiceService.updateProviderServiceStatus(req.params.id, "rejected");
            return res.status(200).json({ success: true, message: "Provider service suspended", data: updated });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default new AdminProviderServiceController();
