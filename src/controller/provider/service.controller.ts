import { Request, Response } from "express";
import ServiceService from "../../services/provider/service.service";
import { ProviderRepository } from "../../repositories/provider/provider.repository";

const providerRepo = new ProviderRepository();

export class ProviderServiceController {
  async create(req: Request, res: Response) {
    try {
      const providerId = (req as any).provider?._id?.toString() || req.body.providerId;
      if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized provider" });
      const provider = await providerRepo.getProviderById(providerId);
      if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });
      const providerType = (provider as any).providerType;

      if (providerType === "shop") {
        return res.status(403).json({ success: false, message: "Shop owners cannot create service bookings" });
      }

      const payload = {
        ...req.body,
        providerId,
        category: req.body.category || req.body.catergory,
      };

      if (providerType === "vet") {
        if (payload.category && payload.category !== "vet") {
          return res.status(400).json({ success: false, message: "Vet providers can only create vet category services" });
        }
        payload.category = "vet";
      }

      if (providerType === "babysitter" && payload.category === "vet") {
        return res.status(400).json({ success: false, message: "Groomer providers cannot create vet category services" });
      }

      const service = await ServiceService.createService(payload as any);
      return res.status(201).json(service);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const providerId = (req as any).provider?._id?.toString();
      if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized provider" });
      const provider = await providerRepo.getProviderById(providerId);
      if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });
      if ((provider as any).providerType === "shop") {
        return res.status(403).json({ success: false, message: "Shop owners cannot access service management" });
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await ServiceService.getServicesByProviderId(providerId, page, limit);
      return res.json(result);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const providerId = (req as any).provider?._id?.toString();
      if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized provider" });
      const provider = await providerRepo.getProviderById(providerId);
      if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });
      if ((provider as any).providerType === "shop") {
        return res.status(403).json({ success: false, message: "Shop owners cannot access service management" });
      }
      const service = await ServiceService.getServiceById(req.params.id);
      if (!service) return res.status(404).json({ success: false, message: "Service not found" });
      if ((service as any).providerId?.toString() !== providerId.toString()) {
        return res.status(403).json({ success: false, message: "Forbidden: not your service" });
      }
      return res.json(service);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const providerId = (req as any).provider?._id?.toString();
      if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized provider" });
      const provider = await providerRepo.getProviderById(providerId);
      if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });
      const providerType = (provider as any).providerType;

      if (providerType === "shop") {
        return res.status(403).json({ success: false, message: "Shop owners cannot update service bookings" });
      }

      const updates = { ...req.body, category: req.body.category || req.body.catergory } as any;

      if (providerType === "vet") {
        if (updates.category && updates.category !== "vet") {
          return res.status(400).json({ success: false, message: "Vet providers can only manage vet category services" });
        }
        updates.category = "vet";
      }

      if (providerType === "babysitter" && updates.category === "vet") {
        return res.status(400).json({ success: false, message: "Groomer providers cannot create vet category services" });
      }

      const updated = await ServiceService.updateServiceForProvider(providerId, req.params.id, updates as any);
      return res.json(updated);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const providerId = (req as any).provider?._id?.toString();
      if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized provider" });
      const provider = await providerRepo.getProviderById(providerId);
      if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });
      if ((provider as any).providerType === "shop") {
        return res.status(403).json({ success: false, message: "Shop owners cannot delete service bookings" });
      }
      const deleted = await ServiceService.deleteServiceForProvider(providerId, req.params.id);
      return res.json({ success: true, deleted });
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }
}

export default new ProviderServiceController();
