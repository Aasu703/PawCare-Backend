import { Request, Response } from "express";
import ServiceService from "../services/service.service";

class ServiceController {
  async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await ServiceService.getAllServices(page, limit);
      return res.json(result);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const service = await ServiceService.getServiceById(req.params.id);
      if (!service) return res.status(404).json({ success: false, message: "Service not found" });
      return res.json(service);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async listByProvider(req: Request, res: Response) {
    try {
      const providerId = req.params.providerId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      // reuse ServiceModel via ServiceRepository directly here for simplicity
      const { services, total } = await ServiceService.getAllServices(page, limit);
      const filtered = services.filter((s: any) => s.providerId === providerId);
      return res.json({ services: filtered, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) });
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }
}

export default new ServiceController();
