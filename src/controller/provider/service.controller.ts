import { Request, Response } from "express";
import ServiceService from "../../services/service.service";
import { ProviderRepository } from "../../repositories/provider.repository";

const providerRepo = new ProviderRepository();

class ProviderServiceController {
  // Provider creates a service for their own provider profile
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== 'provider') return res.status(403).json({ message: 'Forbidden' });

      const provider = await providerRepo.getProviderByUserId(user.id || user._id?.toString());
      if (!provider) return res.status(404).json({ message: 'Provider profile not found for this user' });

      const payload = { ...req.body, providerId: provider._id.toString() };
      const service = await ServiceService.createService(payload as any);
      return res.status(201).json(service);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== 'provider') return res.status(403).json({ message: 'Forbidden' });

      const provider = await providerRepo.getProviderByUserId(user.id || user._id?.toString());
      if (!provider) return res.status(404).json({ message: 'Provider profile not found for this user' });

      // Use provider-scoped update to enforce ownership
      const updated = await ServiceService.updateServiceForProvider(
        provider._id.toString(),
        req.params.id,
        req.body
      );
      return res.json(updated);
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== 'provider') return res.status(403).json({ message: 'Forbidden' });

      const provider = await providerRepo.getProviderByUserId(user.id || user._id?.toString());
      if (!provider) return res.status(404).json({ message: 'Provider profile not found for this user' });

      const deleted = await ServiceService.deleteServiceForProvider(provider._id.toString(), req.params.id);
      return res.json({ success: true, deleted });
    } catch (err: any) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }
}

export default new ProviderServiceController();
