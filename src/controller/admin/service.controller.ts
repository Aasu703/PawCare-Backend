import { Request, Response } from "express";
import ServiceService from "../../services/provider/service.service";
import { ProviderRepository } from "../../repositories/provider/provider.repository";

const providerRepo = new ProviderRepository();

export class AdminServiceController {
  async create(req: Request, res: Response) {
    try {
      const providerId = req.body.providerId;
      if (!providerId) return res.status(400).json({ message: 'providerId is required' });
      const provider = await providerRepo.getProviderById(providerId);
      if (!provider) return res.status(404).json({ message: 'Provider not found' });
      const service = await ServiceService.createService(req.body);
      return res.status(201).json(service);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

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
      return res.json(service);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await ServiceService.updateService(req.params.id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const deleted = await ServiceService.deleteService(req.params.id);
      return res.json({ success: true, deleted });
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }
}

export default new AdminServiceController();
